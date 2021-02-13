
const fs = require('fs');
const path = require('path');

const toJson = require('csvtojson');

const {Calculator} = require('../src/calculate/calculator.js');
const {Collection} = require('../src/data/collection.js');
const formula = require('../src/calculate/formula.js');

const collection = new Collection();

/**
 * I wanna figure out how to take the below and make some of it event
 * easier to script.  There's a lot of boilerplate there
 **/
const formulas = {
	'average-5.close': {
		requirements: [{
			field: 'close',
			size: 5
		}],
		calculate: function(vals){
			return formula.average(vals);
		}
	},

	'average-20.close': {
		requirements: [{
			field: 'close',
			size: 20
		}],
		calculate: formula.average
	},

	'delta.close': {
		requirements: [{
			field: 'close',
			offset: 1
		}, {
			field: 'close',
			offset: 0
		}],
		calculate: function(was, became){
			return became - was;
		}
	},

	'average-50.volume': {
		requirements: [{
			field: 'volume',
			size: 50
		}],
		calculate: formula.average
	},

	'normalized-50.volume': {
		requirements: [{
			field: 'volume',
			offset: 0
		}, {
			formula: 'average-50.volume'
		}],
		calculate: function(volume, avg){
			return volume / avg;
		}
	},

	'normalized-50.close': {
		requirements: [{
			formula: 'delta.close'
		}, {
			formula: 'normalized-50.volume'
		}],
		calculate: function(delta, normalized){
			return delta * normalized;
		}
	},
	
	'average-10.volume': {
		requirements: [{
			field: 'volume',
			size: 10
		}],
		calculate: formula.average
	},

	'normalized-10.volume': {
		requirements: [{
			field: 'volume',
			offset: 0
		}, {
			formula: 'average-10.volume'
		}],
		calculate: function(volume, avg){
			return volume / avg;
		}
	},

	'average-5.volume': {
		requirements: [{
			field: 'volume',
			size: 5
		}],
		calculate: formula.average
	},

	'normalized-5.volume': {
		requirements: [{
			field: 'volume',
			offset: 0
		}, {
			formula: 'average-5.volume'
		}],
		calculate: function(volume, avg){
			return volume / avg;
		}
	},

	'smooth.gaussian-5-1.close': {
		requirements: [{
			field: 'close',
			size: 5
		}],
		calculate: formula.kernelFactory('gaussian', 1)
	},
	
	'smooth.gaussian-10-1.close': {
		requirements: [{
			field: 'close',
			size: 10
		}],
		calculate: formula.kernelFactory('gaussian', 1)
	},
	
	'smooth.gaussian-10-2.close': {
		requirements: [{
			field: 'close',
			size: 10
		}],
		calculate: formula.kernelFactory('gaussian', 2)
	},
	
	'smooth.silverman-5-1.close': {
		requirements: [{
			field: 'close',
			size: 5
		}],
		calculate: formula.kernelFactory('silverman', 1)
	},
	
	'smooth.silverman-10-1.close': {
		requirements: [{
			field: 'close',
			size: 10
		}],
		calculate: formula.kernelFactory('silverman', 1)
	},
	
	'smooth.silverman-10-2.close': {
		requirements: [{
			field: 'close',
			size: 10
		}],
		calculate: formula.kernelFactory('silverman', 2)
	},

	'trending.up.test1': {
		requirements: [{
			field: 'close',
			offset: 1
		}, {
			formula: 'smooth.gaussian-5-1.close'
		}],
		calculate: function(close, smooth){
			return close < smooth;
		}
	},

	'trending.up.test2': {
		requirements: [{
			formula: 'average-5.close'
		}, {
			formula: 'smooth.gaussian-5-1.close'
		}],
		calculate: function(avg, smooth){
			return avg < smooth;
		}
	},

	'trending.up.test3': {
		requirements: [{
			formula: 'average-20.close'
		}, {
			formula: 'smooth.gaussian-10-1.close'
		}],
		calculate: function(avg, smooth){
			return avg < smooth;
		}
	}
};

const calculator = new Calculator(collection, formulas);

async function run(date){
	console.log('for date', date);
	
	console.log(JSON.stringify(await collection.getDatum(date), null, 2));
	
	console.log(JSON.stringify(await calculator.dumpDatum(date), null, 2));
}

const file = path.resolve(__dirname, './AMD.csv');

toJson()
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
).then(() => run('2021-02-08'))
.then(() => run('2021-02-05'))
.then(() => run('2021-02-04'))
.then(() => run('2021-02-03'))
.then(() => run('2020-12-16'))
.then(() => run('2020-11-03'))
.then(async () => {
	const formulas = ['open','low','high','close'].concat(
		calculator.getFormulas()
	);

	const content = await calculator.dump({limit:100, formulas});

	const graphs = [{
		title: 'Close',
		lines: [{
			field: 'average-5.close',
			color: 'orange'
		},{
			field: 'average-20.close',
			color: 'red'
		},{
			field: 'close',
			color: 'steelblue',
		}, {
			field: 'smooth.gaussian-10-2.close',
			color: 'green',
		}, {
			field: 'smooth.silverman-10-2.close',
			color: 'grey'
		}]
	}, {
		title: 'Normalized Close',
		lines: [{
			field: 'delta.close',
			color: 'orange'
		},{
			field: 'normalized-50.close',
			color: 'red'
		}]
	}];

	fs.writeFile(
		path.resolve(__dirname, './display/calculated.json'), 
		JSON.stringify({content, graphs}, null, '\t'), 
		err => {
		    if (err) {
		        console.log('Error writing file', err)
		    } else {
		        console.log('Successfully wrote file')
		    }
		}
	)
});
