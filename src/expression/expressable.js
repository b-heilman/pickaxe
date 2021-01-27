
// [operand] [operator] [operand]

class Expressable {
	constructor(left, operator, right){
		this.left = left;
		this.right = right;
		this.operator = operator;
	}

	async express(ctx){
		return this.operator.express(this.left, this.right, ctx);
	}
}

module.exports = {
	Expressable
};
