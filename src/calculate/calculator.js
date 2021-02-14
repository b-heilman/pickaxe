
class Calculator {
	constructor(collection){
		this.expressors = {};
		this.collection = collection;
	}

	addExpressor(name, expressor){
		this.expressors[name] = expressor;
	}

	async require(req){
		if (req.raw){
			const size = req.size - 1;

			if (size > 1){
				return Promise.all(
					this.collection.getRange(
						interval,
						size,
						req.offset
					).map(
						sub => this.collection.getDatum(sub)
						.getRaw(req.raw)
					)
				);
			} else if (req.offset){
				return this.collection.getDatum(
					interval, 
					req.offset
				).getRaw(req.raw);
			} else {
				return datum.getRaw(req.raw);
			}
		} else if (req.type){
			const expressor = this.expressors[req.type]

			if (expressor){
				return expressor.require(req);
			} else {
				throw new Error('Unknown expressor: '+req.type);
			}
		} else {
			throw new Error('Unknown requirement: '+JSON.stringify(req));
		}
	}

	async requirements(requirements){
		return Promise.all(requirements.map(
			req => this.require(req)
		));
	}

	async express(exp, datum){
		const reqs = await this.requirements(exp.requirements);

		return exp.calculate(...reqs);
	}

	// this shoupd be renamed and refactored, it needs to 
	// call the expressors... but... can I do that off just the
	// formula in a note... brute force way?
	async calc(formula, interval){
		const exp = this.expressions[formula];
		const datum = this.collection.getDatum(interval);
		let value = datum.get(formula);

		if (exp && datum){
			if (value === undefined){
				value = await this.express(exp, datum);

				datum.set(formula, value);
			}

			return value;
		} else if (!exp){
			throw new Error(`unknown formula: ${formula}`);
		} else {
			console.log('debug', this.collection.getKeys());
			throw new Error(`unknown datum: ${interval}`);
		}
	}

	getKeys(){
		return Object.keys(this.expressions);
	}

	async calcAll(expression, limit=0){
		let keys = this.collection.getKeys();

		if (limit){
			keys = keys.slice(keys.length-limit);
		}

		return Promise.all(keys.map(
			async (interval) => ({
				interval,
				value: await this.calc(expression, interval)
			})
		));
	}

	async dumpDatum(interval, expressions = null, raws = []){
		if (!expressions){
			expressions = this.getKeys();
		}

		let raw = raws.length ?
			this.collection.getDatum(interval).copyRaw(raws) :
			{};

		return expressions.reduce(
			async (prom, expression) => {
				const [agg, value] = await Promise.all([
					prom,
					this.calc(expression, interval)
				]);

				agg[expression] = value;

				return agg;
			},
			Promise.resolve(raw)
		);
	}

	async dump(config={}){
		let keys = this.collection.getKeys();

		if (config.limit){
			keys = keys.slice(keys.length-config.limit);
		}

		return Promise.all(keys.map(
			async (interval) => ({
				values: await this.dumpDatum(interval, config.formulas, config.raws),
				interval: interval
			})
		));
	}
}

module.exports = {
	Calculator
};
