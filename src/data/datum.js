
const {get, set} = require('bmoor/src/core.js');

// singular instance on the sequence.  
// POJO that has and index of [class][...order][value]
// attempts to normalize how data is defined on a datum level
function computePath(classification, field, filters = null){
	if (filters && filters.length){
		const f = filters.slice(0);

		f.unshift(classification);
		f.push(field);

		return f;
	} else {
		return [classification, field];
	}
}

class Datum {
	constructor(data){
		this.raw = data;
		this._ = {};
	}

	getRaw(field){
		return get(this.raw, field);
	}

	copyRaw(fields){
		return fields.reduce(
			(agg, field) => {
				set(agg, field, this.getRaw(field));
				
				return agg;
			},
			{}
		);
	}

	get(path){
		return get(this._, path);
	}

	set(path, value){
		return set(this._, path, value);
	}

	toJSON(){
		return this._;
	}
}

module.exports = {
	Datum,
	computePath
};
