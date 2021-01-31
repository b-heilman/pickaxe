
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

	getIndex(name){
		return this.index[name];
	}

	getRange(from, to){
		const fi = this.index[from];
		const ti = this.index[to];

		const rtn = [];
		if (fi < ti){
			for(let i = fi; i <= ti; i++){
				rtn.push(i);
			}
		} else {
			for(let i = ti; i <= fi; i++){
				rtn.push(i);
			}
		}

		return rtn;
	}
}