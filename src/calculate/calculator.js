
class Calculator {
	constructor(collection){
		this.expressors = {};
		this.collection = collection;
	}

	addExpressor(name, expressor){
		this.expressors[name] = expressor;
	}

	async require(interval, req){
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
			} else {
				return this.collection.getDatum(
					interval, 
					req.offset
				).getRaw(req.raw);
			}
		} else if (req.type){
			const expressor = this.expressors[req.type];

			if (expressor){
				return expressor.require(interval, req);
			} else {
				throw new Error('Unknown expressor: '+req.type);
			}
		} else {
			throw new Error('Unknown requirement: '+JSON.stringify(req));
		}
	}

	// this shoupd be renamed and refactored, it needs to 
	// call the expressors... but... can I do that off just the
	// formula in a note... brute force way?
	async express(expression, interval){
		const expressor = Object.keys(this.expressors)
		.reduce(
			(agg, key) => {
				if (agg){
					return agg;
				}

				const expressor = this.expressors[key];

				if (expressor.hasExpression(expression)){
					return expressor;
				}
			},
			null
		);

		if (!expressor){
			throw new Error('unknown expression: '+expression);
		}

		return expressor.calculate(expression, interval);
	}

	getKeys(){
		const res = Object.values(this.expressors)
			.map(expressor => expressor.getExpressions());

		return [].concat(...res);
	}

	async calcAll(expression, limit=0){
		let keys = this.collection.getKeys();

		if (limit){
			keys = keys.slice(keys.length-limit);
		}

		return Promise.all(keys.map(
			async (interval) => ({
				interval,
				value: await this.express(expression, interval)
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
					this.express(expression, interval)
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
				values: await this.dumpDatum(interval, config.expressions, config.raws),
				interval: interval
			})
		));
	}
}

module.exports = {
	Calculator
};
