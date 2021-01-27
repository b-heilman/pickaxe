
class Operand {
	constructor(field){
		this.field = field;
	}

	async getValue(ctx){
		return ctx[this.field];
	}

	toJson(){
		return this.field;
	}
}

module.exports = {
	Operand
};
