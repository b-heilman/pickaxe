
const {expect} = require('chai');

describe('calculate/caculator', function() {
	const sut = require('./calculator.js');
	const {Collection} = require('../data/collection.js');

	let collection = null;
	let calculator = null;

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
			value: 5
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

		const formulas = {
			'average.value': {
				requirements: [{
					field: 'value',
					range: 3
				}],
				calculate: function(vals){
					return vals.reduce((agg, val) => agg+val,0) / vals.length;
				}
			},
			'trending.up': {
				requirements: [{
					field: 'value'
				}, {
					formula: 'average.value'
				}],
				calculate: function(val, avg){
					return val > avg;
				}
			},
			'trending.wasUp': {
				requirements: [{
					field: 'value'
				}, {
					formula: 'average.value',
					offset: 2
				}],
				calculate: function(val, avg){
					return val > avg;
				}
			}
		};

		calculator = new sut.Calculator(collection, formulas);
	});

	describe('.calc', function(){
		it('should work for average', async function(){
			expect(
				await calculator.calc(
					'average.value', '2020-01-01'
				)
			).to.equal(10);

			expect(
				await calculator.calc(
					'average.value', '2020-01-02'
				)
			).to.equal(10.5);

			expect(
				await calculator.calc(
					'average.value', '2020-01-05'
				)
			).to.equal(11);

			expect(
				await calculator.calc(
					'average.value', '2020-01-13'
				)
			).to.equal(5);
		});

		it('should work for trending.up', async function(){
			expect(
				await calculator.calc('trending.up', '2020-01-04')
			).to.equal(false);

			expect(
				await calculator.calc('trending.up', '2020-01-12')
			).to.equal(false);

			expect(
				await calculator.calc('trending.up', '2020-01-13')
			).to.equal(true);
		});

		it('should work for trending.wasUp', async function(){
			expect(
				await calculator.calc('trending.wasUp', '2020-01-04')
			).to.equal(true);

			expect(
				await calculator.calc('trending.wasUp', '2020-01-12')
			).to.equal(false);

			expect(
				await calculator.calc('trending.wasUp', '2020-01-13')
			).to.equal(true);
		});
	});
});
