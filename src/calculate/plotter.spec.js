
const {expect} = require('chai');

describe('calculate/drawer', function() {
	const sut = require('./plotter.js');

	const {Drawer} = require('./drawer.js');
	const {Collection} = require('../data/collection.js');
	const {Calculator} = require('./calculator.js');

	let collection = null;
	let calculator = null;
	let drawer = null;
	let plotter = null;

	beforeEach(function(){
		collection = new Collection();

		collection.addDatum('2020-01-01', {
			value: 10
		});

		collection.addDatum('2020-01-02', {
			value: 11
		});

		collection.addDatum('2020-01-03', {
			value: 12
		});

		collection.addDatum('2020-01-04', {
			value: 11
		});

		collection.addDatum('2020-01-05', {
			value: 10
		});

		collection.addDatum('2020-01-06', {
			value: 9
		});

		collection.addDatum('2020-01-07', {
			value: 8
		});

		collection.addDatum('2020-01-08', {
			value: 7
		});

		collection.addDatum('2020-01-09', {
			value: 6
		});

		collection.addDatum('2020-01-10', {
			value: 2
		});

		collection.addDatum('2020-01-11', {
			value: 4
		});

		collection.addDatum('2020-01-12', {
			value: 5
		});

		collection.addDatum('2020-01-13', {
			value: 6
		});

		collection.addDatum('2020-01-14', {
			value: 5
		});

		collection.addDatum('2020-01-15', {
			value: 8
		});

		const lines = {
			'average.value': {
				requirements: [{
					raw: 'value',
					size: 3
				}],
				express: function(vals){
					return vals.reduce((agg, val) => agg+val,0) / vals.length;
				}
			}
		};

		const plots = {
			'trending.up': {
				requirements: [{
					raw: 'value'
				}, {
					type: 'line',
					name: 'average.value'
				}],
				express: function(val, avg){
					return val > avg;
				}
			},
			'trending.wasUp': {
				requirements: [{
					raw: 'value'
				}, {
					type: 'line',
					name: 'average.value',
					offset: 2
				}],
				express: function(val, avg){
					return val > avg;
				}
			}
		};

		calculator = new Calculator(collection);
		
		drawer = new Drawer(calculator, lines);
		plotter = new sut.Plotter(calculator, plots);
	});

	describe('.calculate', function(){
		it('should work for trending.up', async function(){
			expect(
				await plotter.calculate('trending.up', '2020-01-04')
			).to.equal(false);

			expect(
				await plotter.calculate('trending.up', '2020-01-12')
			).to.equal(true);

			expect(
				await plotter.calculate('trending.up', '2020-01-13')
			).to.equal(true);
		});

		it('should work for trending.wasUp', async function(){
			expect(
				await plotter.calculate('trending.wasUp', '2020-01-04')
			).to.equal(true);

			expect(
				await plotter.calculate('trending.wasUp', '2020-01-12')
			).to.equal(false);

			expect(
				await plotter.calculate('trending.wasUp', '2020-01-13')
			).to.equal(true);
		});
	});

	describe('.calculator.dumpDatum', function(){
		it('should encode things propertly without raws', async function(){
			const datum = await drawer.calculator.dumpDatum(
				'2020-01-12',
				['trending.up', 'trending.wasUp']
			);

			expect(datum)
			.to.deep.equal({
				'trending.up': true,
				'trending.wasUp': false
			});
		});

		it('should encode things propertly with raws', async function(){
			const datum = await drawer.calculator.dumpDatum(
				'2020-01-12',
				['trending.up', 'trending.wasUp'],
				['value']
			);

			expect(datum)
			.to.deep.equal({
				value: 5,
				'trending.up': true,
				'trending.wasUp': false
			});
		});
	});

	describe('.calculator.dump', function(){
		it('should encode things propertly without raws', async function(){
			const datum = await drawer.calculator.dump({
				limit: 2,
				expressions: ['trending.up', 'trending.wasUp']
			});

			expect(datum)
			.to.deep.equal([{
				interval: '2020-01-14',
				values: {
					'trending.up': false,
					'trending.wasUp': true
				}
			}, {
				interval: '2020-01-15',
				values: {
					'trending.up': true,
					'trending.wasUp': true
				}
			}]);
		});

		it('should encode things propertly without raws and formulas', async function(){
			const datum = await drawer.calculator.dump({
				limit: 3
			});

			expect(datum)
			.to.deep.equal([{
				interval: '2020-01-13',
				values: {
					'average.value': 5,
					'trending.up': true,
					'trending.wasUp': true
				}
			}, {
				interval: '2020-01-14',
				values: {
					'average.value': 5.333333333333333,
					'trending.up': false,
					'trending.wasUp': true
				}
			}, {
				interval: '2020-01-15',
				values: {
					'average.value': 6.333333333333333,
					'trending.up': true,
					'trending.wasUp': true
				}
			}]);
		});

		it('should encode things propertly with raws', async function(){
			const datum = await drawer.calculator.dump({
				limit: 2,
				expressions: ['trending.up', 'trending.wasUp'],
				raws: ['value']
			});

			expect(datum)
			.to.deep.equal([{
				interval: '2020-01-14',
				values: {
					value: 5,
					'trending.up': false,
					'trending.wasUp': true
				}
			}, {
				interval: '2020-01-15',
				values: {
					value: 8,
					'trending.up': true,
					'trending.wasUp': true
				}
			}]);
		});
	});
});
