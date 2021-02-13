
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
				collection.getAt('2020-01-03').datum.getRaw('value')
			).to.deep.equal(3);

			expect(
				collection.getAt('2020-01-07', 2).datum.getRaw('value')
			).to.deep.equal(5);
		});
	});

	describe('.getDatum', function(){
		it('should work', function(){
			expect(
				collection.getDatum('2020-01-03').getRaw('value')
			).to.deep.equal(3);

			expect(
				collection.getDatum('2020-01-03').get('value')
			).to.equal(undefined);

			collection.getDatum('2020-01-03').set('value', 10);

			expect(
				collection.getDatum('2020-01-03').getRaw('value')
			).to.deep.equal(3);

			expect(
				collection.getDatum('2020-01-03').get('value')
			).to.equal(10);

			expect(
				collection.getDatum('2020-01-07', 2).getRaw('value')
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
		it('should work with no changes', function(){
			expect(
				JSON.parse(JSON.stringify(collection))
			).to.deep.equal([
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{}
			]);
		});


		it('should work with changes', function(){

			collection.getDatum('2020-01-01').set('foo', 10);
			collection.getDatum('2020-01-02').set('bar', 20);
			collection.getDatum('2020-01-03').set('hello', 30);
			collection.getDatum('2020-01-04').set('world', 40);
			collection.getDatum('2020-01-05').set('eins', 50);
			collection.getDatum('2020-01-06').set('value.zwei', 60);
			collection.getDatum('2020-01-07').set('value.drei', 70);

			expect(
				JSON.parse(JSON.stringify(collection))
			).to.deep.equal([
				{foo: 10},
				{bar: 20},
				{hello: 30},
				{world: 40},
				{eins: 50},
				{value: {zwei: 60}},
				{value: {drei: 70}},
				{}
			]);
		});
	});
});
