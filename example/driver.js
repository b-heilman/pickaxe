
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
			console.log('->', delta, '*', normalized);
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
	
	console.log(JSON.stringify(await calculator.dump(date), null, 2));
}

const file = path.normalize(__dirname+'/AMD.csv');

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
	console.log(await calculator.calcAll('normalized-50.close'));
});
