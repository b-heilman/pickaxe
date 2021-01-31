
// able to be expressed and the state tested
// chain of molecules
// wraps expression/sequence

class Chromosome {
	constructor(dataSequence, expressableSequence){
		this.data = dataSequence;
		this.expressable - expressableSequence;
	}

	async express(interval){
		return this.expressable.express(
			this.data.get(interval)
		);
	}

	async getConfidence(interval){
		return this.expressable.getConfidence(
			this.data.get(interval)
		);
	}
}

module.exports = {
	Chromosome
};
