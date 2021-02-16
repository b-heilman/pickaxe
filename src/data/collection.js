
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

	addDatum(interval, datum = {}){
		const i = this._.length;
		this.index[interval] = i;

		this._.push({
			interval,
			datum: new Datum(datum)
		});
	}

	intervalAt(pos){
		if (pos < 0 || pos >= this._.length){
			return null;
		} else {
			return this._[pos].interval;
		}
	}

	nextInterval(interval){
		return this.intervalAt(
			this.index[interval]+1
		);
	}

	prevInterval(interval){
		return this.intervalAt(
			this.index[interval]-1
		);
	}

	getAt(interval, offset=0){
		let pos = this.index[interval]-offset;

		if (pos < 0){
			pos = 0;
		} else if (pos >= this._.length){
			pos = this._.length - 1;
		}

		return this._[pos];
	}

	getDatum(interval, offset){
		return this.getAt(interval, offset).datum;
	}

	getOffset(interval, offset){
		return this.getAt(interval, offset).interval;
	}

	getRange(interval, width, offset=0){
		const end = this.index[interval] - offset;
		const rtn = [];
		let pos = end - width;

		if (pos < 0){
			pos = 0;
		}

		for(let i = pos, c = end+1; i < c; i++){
			rtn.push(this._[i].interval);
		}

		return rtn;
	}

	getAll(){
		return this._.map(d => d.datum);
	}

	getKeys(){
		return this._.map(d => d.interval);
	}

	getValues(path){
		return this._.map(d => d.datum.get(path));
	}

	getEntries(path){
		return this._.map(d => ({
			interval: d.interval,
			value: d.datum.get(path)
		}));
	}

	toJSON(){
		return this.getAll();
	}
}

module.exports = {
	Collection
};
