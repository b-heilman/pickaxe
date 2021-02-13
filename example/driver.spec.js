
const fs = require('fs');
const path = require('path');
const {expect} = require('chai');

const toJson = require('csvtojson');

const {Calculator} = require('../src/calculate/calculator.js');
const {Collection} = require('../src/data/collection.js');
const formula = require('../src/calculate/formula.js');

/**
 * I wanna figure out how to take the below and make some of it event
 * easier to script.  There's a lot of boilerplate there
 **/
const formulas = {
	'value.close.average.5': {
		requirements: [{
			raw: 'close',
			size: 5
		}],
		calculate: formula.average
	},

	'value.close.average.10': {
		requirements: [{
			raw: 'close',
			size: 10
		}],
		calculate: formula.average
	},

	'value.close.average.20': {
		requirements: [{
			raw: 'close',
			size: 20
		}],
		calculate: formula.average
	},

	'value.volume.average.5': {
		requirements: [{
			raw: 'volume',
			size: 5
		}],
		calculate: formula.average
	},
	
	'value.volume.average.10': {
		requirements: [{
			raw: 'volume',
			size: 10
		}],
		calculate: formula.average
	},

	'value.volume.average.50': {
		requirements: [{
			raw: 'volume',
			size: 50
		}],
		calculate: formula.average
	},

	'value.close.smooth.gaussian.5-1': {
		requirements: [{
			raw: 'close',
			size: 5
		}],
		calculate: formula.kernelFactory('gaussian', 1)
	},
	
	'value.close.smooth.gaussian.10-1': {
		requirements: [{
			raw: 'close',
			size: 10
		}],
		calculate: formula.kernelFactory('gaussian', 1)
	},
	
	'value.close.smooth.gaussian.10-2': {
		requirements: [{
			raw: 'close',
			size: 10
		}],
		calculate: formula.kernelFactory('gaussian', 2)
	},
	
	'value.close.smooth.silverman.5-1': {
		requirements: [{
			raw: 'close',
			size: 5
		}],
		calculate: formula.kernelFactory('silverman', 1)
	},
	
	'value.close.smooth.silverman.10-1': {
		requirements: [{
			raw: 'close',
			size: 10
		}],
		calculate: formula.kernelFactory('silverman', 1)
	},
	
	'value.close.smooth.silverman.10-2': {
		requirements: [{
			raw: 'close',
			size: 10
		}],
		calculate: formula.kernelFactory('silverman', 2)
	},

	'delta.close': {
		requirements: [{
			raw: 'close',
			offset: 1
		}, {
			raw: 'close',
			offset: 0
		}],
		calculate: function(was, became){
			return became - was;
		}
	},

	'normalized.close.50': {
		requirements: [{
			raw: 'close',
			offset: 0
		}, {
			formula: 'value.close.average.50'
		}],
		calculate: function(close, avg){
			return close / avg;
		}
	},

	'normalized.volume.5': {
		requirements: [{
			raw: 'volume',
			offset: 0
		}, {
			formula: 'value.volume.average.5'
		}],
		calculate: function(volume, avg){
			return volume / avg;
		}
	},

	'normalized.volume.10': {
		requirements: [{
			raw: 'volume',
			offset: 0
		}, {
			formula: 'value.volume.average.10'
		}],
		calculate: function(volume, avg){
			return volume / avg;
		}
	},

	'normalized.volume.50': {
		requirements: [{
			raw: 'volume',
			offset: 0
		}, {
			formula: 'value.volume.average.50'
		}],
		calculate: function(volume, avg){
			return volume / avg;
		}
	},

	'strength.close.50': {
		requirements: [{
			formula: 'delta.close'
		}, {
			formula: 'normalized.volume.50'
		}],
		calculate: function(delta, normalized){
			return delta * normalized;
		}
	},

	'trending.up.test1': {
		requirements: [{
			raw: 'close',
			offset: 1
		}, {
			formula: 'value.close.smooth.gaussian.5-1'
		}],
		calculate: function(close, smooth){
			return close < smooth;
		}
	},

	'trending.up.test2': {
		requirements: [{
			formula: 'value.close.average.5'
		}, {
			formula: 'value.close.smooth.gaussian.5-1'
		}],
		calculate: function(avg, smooth){
			return avg < smooth;
		}
	},

	'trending.up.test3': {
		requirements: [{
			formula: 'value.close.average.20'
		}, {
			formula: 'value.close.smooth.gaussian.10-1'
		}],
		calculate: function(avg, smooth){
			return avg < smooth;
		}
	}
};

describe('*example*/driver', function(){
	let prom = null;
	let calculator = null;

	const collection = new Collection();

	it('should successfully load the calculator', async function(){
		calculator = new Calculator(collection, formulas);

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
			formulas: calculator.getFormulas(), 
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
