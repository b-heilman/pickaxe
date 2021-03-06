
const {expect} = require('chai');

describe('data/datum', function() {
	const sut = require('./datum.js');

	describe('.get', function(){
		it('should allow access to defined variables', async function(){
			const datum = new sut.Datum({foo: 'bar'});

			expect(datum.getRaw('foo'))
			.to.equal('bar');

			expect(datum.get('hello'))
			.to.equal(undefined);
		});
	});

	describe('.set', async function(){
		it('should allow access to defined variables', async function(){
			const datum = new sut.Datum({});

			expect(datum.get('foo'))
			.to.equal(undefined);

			datum.set('foo', 'bar');

			expect(datum.get('foo'))
			.to.equal('bar');

			expect(datum.get('hello'))
			.to.equal(undefined);
		});

	});

	describe('::computePath', async function(){
		it('should work with no filters', function(){
			expect(sut.computePath('foo', 'bar'))
			.to.deep.equal(['foo','bar']);
		});

		it('should work with a filter', function(){
			const incoming = ['hello'];

			expect(sut.computePath('foo', 'bar', incoming))
			.to.deep.equal(['foo','hello','bar']);
		});

		it('should not alter the filters', function(){
			const incoming = ['hello'];

			expect(sut.computePath('foo', 'bar', incoming))
			.to.not.deep.equal(incoming);
		});
	});

	describe('.toJson', async function(){
		it('should properly serialize without changes', function(){
			const datum = new sut.Datum({foo: 'bar'});

			expect(JSON.stringify(datum))
			.to.equal('{}');
		});

		it('should properly serialize with changes', function(){
			const datum = new sut.Datum({foo: 'bar'});

			datum.set('hello', 'world');

			expect(JSON.stringify(datum))
			.to.equal('{"hello":"world"}');
		});
	});
});
