
class Sequence {
	constructor(){
		this.expressables = [];
	}

	addExpressable(expressable){
		this.expressables.push(expressable);
	}

	async express(ctx){
		return (
			await Promise.all(this.expressables.map(
				expressable => expressable.express(ctx)
			))
		).reduce(
			(agg, value) => agg + value,
			0
		);
	}

	async getConfidence(ctx){
		return (await this.express(ctx)) / this.expressables.length;
	}

	toJson(){
		return this.expressables;
	}
}

module.exports = {
	Sequence
};
