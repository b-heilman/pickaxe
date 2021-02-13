
class Calculator {
	constructor(collection, formulas = {}){
		this.formulas = formulas;
		this.collection = collection;
	}

	addSeries(opts, factory){
		return opts.map(
			opt => factory(opt).map(
				settings => this.addFormula(settings)
			)
		);
	}

	addFormula(settings){
		this.formulas[settings.formula] = {
			requirements: settings.requirements,
			calculate: settings.calculate
		};
	}

	async calc(formula, interval){
		const exp = this.formulas[formula];
		const datum = this.collection.getDatum(interval);
		let value = datum.get(formula);

		if (exp && datum){
			if (value === undefined){
				const reqs = await Promise.all(exp.requirements.map(
					async (req) => {
						const subFormula = req.formula;

						if (subFormula){
							const size = req.size - 1;

							if (size > 1){
								return Promise.all(
									this.collection.getRange(
										interval,
										size,
										req.offset
									).map(sub => this.calc(
										subFormula,
										sub
									))
								);
							} else if (req.offset){
								return this.calc(
									subFormula,
									this.collection.getOffset(
										interval,
										req.offset
									)
								);
							} else {
								return this.calc(
									subFormula,
									interval
								);
							}
						} else if (req.raw){
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
						} else {
							throw new Error('Unknown requirement: '+JSON.stringify(req));
						}
					}
				));

				value = exp.calculate(...reqs);

				datum.set(formula, value);
			}

			return value;
		} else if (!exp){
			if (value === undefined){
				throw new Error(`unknown formula: ${formula}`);
			} else {
				return value; // raw value
			}
			
		} else {
			console.log('debug', this.collection.getKeys());
			throw new Error(`unknown datum: ${interval}`);
		}
	}

	getFormulas(){
		return Object.keys(this.formulas);
	}

	async calcAll(formula, limit=0){
		let keys = this.collection.getKeys();

		if (limit){
			keys = keys.slice(keys.length-limit);
		}

		return Promise.all(keys.map(
			async (interval) => ({
				interval,
				value: await this.calc(formula, interval)
			})
		));
	}

	async dumpDatum(interval, formulas = null, raws = []){
		console.log('->', interval, formulas, raws);
		if (!formulas){
			formulas = this.getFormulas();
		}

		let raw = raws.length ?
			this.collection.getDatum(interval).copyRaw(raws) :
			{};

		return formulas.reduce(
			async (prom, formula) => {
				const [agg, value] = await Promise.all([
					prom,
					this.calc(formula, interval)
				]);

				agg[formula] = value;

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
