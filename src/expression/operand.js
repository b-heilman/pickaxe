
class operand {
	constructor(value){
		this._value;
	}

	async getValue(){
		return this._value;
	}

	toJson(){
		return this._value;
	}
}

module.exports = {
	Operand
}
