
const {get, set} = require('bmoor/src/core.js');

// singular instance on the sequence.  
// POJO that has and index of [class][...order][value]
// attempts to normalize how data is defined on a datum level

class Datum {
	constructor(data){
		this._ = data;
	}

	get(path){
		get(this._, path);
	}

	set(path, value){
		set(this._, path, value);
	}

	computePath(classification, field, filters = []){
		filters.unshift(classification);
		filters.push(field);

		return filters;
	}

	fetch(classification, ...filters, field){
		return this.get(
			this.computePath(classification, field, filters)
		);
	}

	assign(classification, ...filters, field, value){
		return this.set(
			this.computePath(classification, field, filters), 
			value
		);
	}
}

module.exports = {
	Datum
};
