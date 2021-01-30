
const {expect} = require('chai');

describe('expression/sequence', function() {
	const sut = require('./sequence.js');
	const {Operand} = require('./operand.js');
	const {Operator} = require('./operator.js');
	const {Expressable} = require('./expressable.js');

	it('should allow a value to come back from context', async function(){
		const eins = new Operand('eins');
		const zwei = new Operand('zwei');
		const drei = new Operand('drei');
		const fier = new Operand('fier');
		const operator = new Operator((left, right) => left > right ? 1 : 0);

		const sequence = new sut.Sequence();

		sequence.addExpressable(new Expressable(eins, operator, zwei));
		sequence.addExpressable(new Expressable(zwei, operator, drei));
		sequence.addExpressable(new Expressable(drei, operator, fier));
		sequence.addExpressable(new Expressable(fier, operator, eins));
	
		expect(await sequence.express({eins: 1, zwei: 2, drei: 3, fier: 4}))
		.to.equal(1);

		expect(await sequence.getConfidence({eins: 1, zwei: 2, drei: 3, fier: 4}))
		.to.equal(0.25);
	});
});
