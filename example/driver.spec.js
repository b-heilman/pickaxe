
const fs = require('fs');
const path = require('path');
const {expect} = require('chai');

const toJson = require('csvtojson');

const {Drawer} = require('../src/calculate/drawer.js');
const {Plotter} = require('../src/calculate/plotter.js');
const {Calculator} = require('../src/calculate/calculator.js');
const {Collection} = require('../src/data/collection.js');
const formula = require('../src/calculate/formula.js');

/**
 * I wanna figure out how to take the below and make some of it event
 * easier to script.  There's a lot of boilerplate there
 **/
const lines = {
	'value.close.average.5': {
		requirements: [{
			raw: 'close',
			size: 5
		}],
		express: formula.average
	},

	'value.close.average.10': {
		requirements: [{
			raw: 'close',
			size: 10
		}],
		express: formula.average
	},

	'value.close.average.50': {
		requirements: [{
			raw: 'close',
			size: 50
		}],
		express: formula.average
	},

	'value.close.average.20': {
		requirements: [{
			raw: 'close',
			size: 20
		}],
		express: formula.average
	},

	'value.volume.average.5': {
		requirements: [{
			raw: 'volume',
			size: 5
		}],
		express: formula.average
	},
	
	'value.volume.average.10': {
		requirements: [{
			raw: 'volume',
			size: 10
		}],
		express: formula.average
	},

	'value.volume.average.50': {
		requirements: [{
			raw: 'volume',
			size: 50
		}],
		express: formula.average
	},

	'value.close.smooth.gaussian.5-1': {
		requirements: [{
			raw: 'close',
			size: 5
		}],
		express: formula.kernelFactory('gaussian', 1)
	},
	
	'value.close.smooth.gaussian.10-1': {
		requirements: [{
			raw: 'close',
			size: 10
		}],
		express: formula.kernelFactory('gaussian', 1)
	},
	
	'value.close.smooth.gaussian.10-2': {
		requirements: [{
			raw: 'close',
			size: 10
		}],
		express: formula.kernelFactory('gaussian', 2)
	},
	
	'value.close.smooth.silverman.5-1': {
		requirements: [{
			raw: 'close',
			size: 5
		}],
		express: formula.kernelFactory('silverman', 1)
	},
	
	'value.close.smooth.silverman.10-1': {
		requirements: [{
			raw: 'close',
			size: 10
		}],
		express: formula.kernelFactory('silverman', 1)
	},
	
	'value.close.smooth.silverman.10-2': {
		requirements: [{
			raw: 'close',
			size: 10
		}],
		express: formula.kernelFactory('silverman', 2)
	},

	'delta.close': {
		requirements: [{
			raw: 'close',
			offset: 1
		}, {
			raw: 'close',
			offset: 0
		}],
		express: function(was, became){
			return became - was;
		}
	},

	'normalized.close.50': {
		requirements: [{
			raw: 'close',
			offset: 0
		}, {
			type: 'line',
			name: 'value.close.average.50'
		}],
		express: function(close, avg){
			return close / avg;
		}
	},

	'normalized.volume.5': {
		requirements: [{
			raw: 'volume',
			offset: 0
		}, {
			type: 'line',
			name: 'value.volume.average.5'
		}],
		express: function(volume, avg){
			return volume / avg;
		}
	},

	'normalized.volume.10': {
		requirements: [{
			raw: 'volume',
			offset: 0
		}, {
			type: 'line',
			name: 'value.volume.average.10'
		}],
		express: function(volume, avg){
			return volume / avg;
		}
	},

	'normalized.volume.50': {
		requirements: [{
			raw: 'volume',
			offset: 0
		}, {
			type: 'line',
			name: 'value.volume.average.50'
		}],
		express: function(volume, avg){
			return volume / avg;
		}
	},

	'strength.close.50': {
		requirements: [{
			type: 'line',
			name: 'delta.close'
		}, {
			type: 'line',
			name: 'normalized.volume.50'
		}],
		express: function(delta, normalized){
			return delta * normalized;
		}
	}
};

const plots = {
	'trending.up.test1': {
		requirements: [{
			raw: 'close',
			offset: 1
		}, {
			type: 'line',
			name: 'value.close.smooth.gaussian.5-1'
		}],
		express: function(close, smooth){
			return close < smooth;
		}
	},

	'trending.up.test2': {
		requirements: [{
			type: 'line',
			name: 'value.close.average.5'
		}, {
			type: 'line',
			name: 'value.close.smooth.gaussian.5-1'
		}],
		express: function(avg, smooth){
			return avg < smooth;
		}
	},

	'trending.up.test3': {
		requirements: [{
			type: 'line',
			name: 'value.close.average.20'
		}, {
			type: 'line',
			name: 'value.close.smooth.gaussian.10-1'
		}],
		express: function(avg, smooth){
			return avg < smooth;
		}
	}
};

describe('*example*/driver', function(){
	let prom = null;
	let drawer = null;
	let plotter = null;
	let calculator = null;

	const collection = new Collection();

	it('should successfully load the calculator', async function(){
		calculator = new Calculator(collection);

		drawer = new Drawer(calculator, lines);
		plotter = new Plotter(calculator, plots);

		expect(true).to.equal(true);
	});

	it('should successfully load the root data', async function(){
		const file = path.resolve(__dirname, './AMD.csv');

		prom = toJson()
		.fromFile(file)
		.then(
			arr => arr.forEach(
				datum => collection.addDatum(datum.Date, {
					open: parseFloat(datum.Open),
					high: parseFloat(datum.High),
					low: parseFloat(datum.Low),
					close: parseFloat(datum.Close),
					volume: parseInt(datum.Volume)
				})
			)
		)

		await prom;

		expect(true).to.equal(true);
	});

	it ('should successfully export processed data', async function(){
		const content = await calculator.dump({
			limit: 100,
			raws: ['close','volume']
		});

		const graphs = [{
			title: 'Close',
			lines: [{
				field: 'close',
				color: 'steelblue',
			}, {
				field: 'value.close.average.5',
				color: 'orange'
			},{
				field: 'value.close.average.10',
				color: 'red'
			},{
				field: 'value.close.average.20',
				color: 'pink'
			},{
				field: 'value.close.smooth.gaussian.10-2',
				color: 'green',
			}, {
				field: 'value.close.smooth.silverman.10-2',
				color: 'grey'
			}],
			points: [{
				field: 'trending.up.test3',
				value: 'close',
				color: 'white'
			}]
		}, {
			title: 'Normalized Close',
			lines: [{
				field: 'delta.close',
				color: 'orange'
			},{
				field: 'strength.close.50',
				color: 'red'
			}]
		}, {
			title: 'Volume',
			lines: [{
				field: 'volume',
				color: 'steelblue'
			},{
				field: 'value.volume.average.50',
				color: 'red'
			},{
				field: 'value.volume.average.10',
				color: 'green'
			}]
		}];

		fs.writeFileSync(
			path.resolve(__dirname, './display/calculated.json'), 
			JSON.stringify({content, graphs}, null, '\t')
		);

		console.log('Successfully wrote file');
		
		expect(true).to.equal(true);
	});
});
