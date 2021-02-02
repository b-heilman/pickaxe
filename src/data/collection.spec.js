
const {expect} = require('chai');

describe('data/collection', function() {
	const sut = require('./collection.js');

	describe('.addDatum', function(){
		it('should allow a value to come back from context', async function(){
			const collection = new sut.Collection();

			collection.addDatum('2020-01-01', {
				value: 1
			});

			collection.addDatum('2020-01-02', {
				value: 2
			});

			expect(collection._.length)
			.to.equal(2);
		});
	});

	let collection = null;
	beforeEach(function(){
		collection = new sut.Collection();

		collection.addDatum('2020-01-01', {
			value: 1
		});

		collection.addDatum('2020-01-02', {
			value: 2
		});

		collection.addDatum('2020-01-03', {
			value: 3
		});

		collection.addDatum('2020-01-04', {
			value: 4
		});

		collection.addDatum('2020-01-05', {
			value: 5
		});

		collection.addDatum('2020-01-06', {
			value: 6
		});

		collection.addDatum('2020-01-07', {
			value: 7
		});

		collection.addDatum('2020-01-08', {
			value: 8
		});
	});

	describe('.getIndex', function(){
		it('should work', function(){
			expect(collection.getIndex('2020-01-03'))
			.to.equal(2);

			expect(collection.getIndex('2020-01-07'))
			.to.equal(6);
		});
	});

	describe('.getByRange', function(){
		it('should work', function(){
			expect(
				collection.getByRange('2020-01-03', '2020-01-07')
				.map(datum => datum.get('value'))
			).to.deep.equal([2,3,4,5,6]);

			expect(
				collection.getByRange('2020-01-07', '2020-01-03')
				.map(datum => datum.get('value'))
			).to.deep.equal([2,3,4,5,6]);
		});
	});

	describe('.getByOffset', function(){
		it('should work', function(){
			expect(
				collection.getByOffset('2020-01-05', 2)
				.map(datum => datum.get('value'))
			).to.deep.equal([2,3,4]);
		});
	});

	describe('.toJson', function(){

	});
});
