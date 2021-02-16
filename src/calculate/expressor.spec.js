
const {expect} = require('chai');

describe('calculate/drawer', function() {
	const sut = require('./expressor.js');

	const {Collection} = require('../data/collection.js');
	const {Calculator} = require('./calculator.js');

	let collection = null;
	let calculator = null;
	let expressor = null;

	beforeEach(function(){
		collection = new Collection();

		collection.addDatum('2020-01-01', {
			foo: 10,
			bar: 20
		});

		collection.addDatum('2020-01-02', {
			foo: 11,
			bar: 21
		});

		collection.addDatum('2020-01-03', {
			foo: 12,
			bar: 22
		});

		collection.addDatum('2020-01-04', {
			foo: 13,
			bar: 23
		});

		collection.addDatum('2020-01-05', {
			foo: 14,
			bar: 24
		});

		collection.addDatum('2020-01-06', {
			foo: 15,
			bar: 25
		});

		collection.addDatum('2020-01-07', {
			foo: 16,
			bar: 26
		});

		collection.addDatum('2020-01-08', {
			foo: 17,
			bar: 27
		});

		collection.addDatum('2020-01-09', {
			foo: 18,
			bar: 28
		});

		collection.addDatum('2020-01-10', {
			foo: 19,
			bar: 29
		});

		const funcs = {
			'value': {
				requirements: [{
					raw: 'bar'
				}],
				express: function(val){
					return val;
				}
			},
			'average': {
				requirements: [{
					raw: 'foo',
					size: 3
				}],
				express: function(vals){
					return vals.reduce((agg, val) => agg+val,0) / vals.length;
				}
			},
			foo: {
				pattern: [{
					raw: 'foo',
					test: (v) => v === 15,
					value: {
						raw: 'bar'
					}
				}, {
					raw: 'bar',
					test: v => v === 22,
					value: {
						type: 'junk',
						name: 'average'
					}
				}],
				express: function(bar, value){
					if (value === null){
						return null;
					} else {
						return bar + value;
					}
				}
			}
		};

		calculator = new Calculator(collection);
		
		expressor = new sut.Expressor('junk', calculator, funcs);
	});

	describe('.calculate', function(){
		it('should work for average', async function(){
			expect(
				await expressor.calculate(
					'value', '2020-01-06'
				)
			).to.equal(25);

			expect(
				await expressor.calculate(
					'average', '2020-01-03'
				)
			).to.equal(11);

			expect(
				await expressor.calculate(
					'foo', '2020-01-08'
				)
			).to.equal(36);

			expect(
				await expressor.calculate(
					'foo', '2020-01-04'
				)
			).to.equal(null);
		});
	});
});
