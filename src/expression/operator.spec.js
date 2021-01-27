
const {expect} = require('chai');

describe('expression/operator', function() {
	const sut = require('./operator.js');

	it('should allow a value to come back from context', async function(){
		const operator = new sut.Operator((left, right) => left - right);

		const value = await operator.express(
			{getValue: () => 1},
			{getValue: () => 2}
		);

		expect(value)
		.to.equal(-1);
	});
});
