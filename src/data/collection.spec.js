
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

	describe('.getAt', function(){
		it('should work', function(){
			expect(
				collection.getAt('2020-01-03').datum.get('value')
			).to.deep.equal(3);

			expect(
				collection.getAt('2020-01-07', 2).datum.get('value')
			).to.deep.equal(5);
		});
	});

	describe('.getDatum', function(){
		it('should work', function(){
			expect(
				collection.getDatum('2020-01-03').get('value')
			).to.deep.equal(3);

			expect(
				collection.getDatum('2020-01-07', 2).get('value')
			).to.deep.equal(5);
		});
	});

	describe('.getRange', function(){
		it('should work', function(){
			expect(
				collection.getRange('2020-01-03', 2)
			).to.deep.equal(['2020-01-01', '2020-01-02', '2020-01-03']);

			expect(
				collection.getRange('2020-01-05', 2, 2)
			).to.deep.equal(['2020-01-01', '2020-01-02', '2020-01-03']);

			expect(
				collection.getRange('2020-01-03', 0)
			).to.deep.equal(['2020-01-03']);

			expect(
				collection.getRange('2020-01-05', 0, 2)
			).to.deep.equal(['2020-01-03']);
		});
	});

	describe('.toJson', function(){
		it('should work', function(){
			expect(
				JSON.parse(JSON.stringify(collection))
			).to.deep.equal([
				{value: 1},
				{value: 2},
				{value: 3},
				{value: 4},
				{value: 5},
				{value: 6},
				{value: 7},
				{value: 8}
			]);
		});
	});
});
