
const {expect} = require('chai');

describe('expression/operand', function() {
	const sut = require('./operand.js');

	it('should allow a value to come back from context', async function(){
		const operand = new sut.Operand('foo');

		expect(await operand.getValue({foo: 'bar'}))
		.to.equal('bar');

		expect(await operand.getValue({hello: 'world'}))
		.to.equal(undefined);
	});
});
