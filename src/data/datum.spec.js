
const {expect} = require('chai');

describe('data/datum', function() {
	const sut = require('./datum.js');

	it('should allow a value to come back from context', async function(){
		const left = new Operand('eins');
		const right = new Operand('zwei');
		const operator = new Operator((left, right) => left + right);
		const expressable = new sut.Expressable(left, operator, right);

		expect(await expressable.express({eins: 1, zwei: 2}))
		.to.equal(3);

		expect(await expressable.express({eins: 10, zwei: 20}))
		.to.equal(30);
	});
});
