
class Sequence {
	constructor(fn, symbol){
		this.expressions = [];
	}

	addExpression(expressable){
		this.expressions.push(expressable);
	}

	async getConfidence(ctx){
		const summation = (
			await this.expressions.map(
				expressable.getConfidence(ctx)
			)
		).reduce(
			(agg, value) => agg + value,
			0
		);

		return summation / this.expressions.length;
	}

	toJson(){
		return this.expressions;
	}
}

module.exports = {
	Sequence
};
