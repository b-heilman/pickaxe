
// series of datums.  It will be populate by an original value and added
// to only by pushing data on the end.  It will build an index that allows
// fast look ins by key reference to index.
//-----
// main functionality will be getting sub sequences

const {Datum} = require('./datum.js');

class Collection{
	constructor(){
		this._ = [];
		this.index = {};
	}

	addDatum(index, datum = {}){
		const i = this._.length;
		this.index[index] = i;

		this._.push(new Datum(datum));
	}

	getIndex(index){
		return this.index[index];
	}

	getByRange(from, to){
		const fi = this.index[from];
		const ti = this.index[to];

		if (fi < ti){
			return this._.slice(fi-1, ti);
		} else {
			return this._.slice(ti-1, fi);
		}
	}

	getByOffset(index, offset){
		const pos = this.index[index];

		return this._.slice(pos-offset-1, pos);
	}

	toJson(){
		return this._;
	}
}

module.exports = {
	Collection
};
