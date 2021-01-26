
class Operator {
	constructor(fn, symbol){
		this.fn = fn;
		this.symbol = symbol;
	}

	async express(operandL, operandR, ctx){
		return this.fn(
			await operandL.getValue(ctx), 
			await operandR.getValue(ctx)
		);
	}

	toJson(){
		return this.symbol;
	}
}

module.exports = {
	Operator
};
