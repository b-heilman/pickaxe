
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

		if (exp && datum){
			let value = datum.get(formula);

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
						} else if (req.field){
							const size = req.size - 1;

							if (size > 1){
								return Promise.all(
									this.collection.getRange(
										interval,
										size,
										req.offset
									).map(
										sub => this.collection.getDatum(sub)
										.get(req.field)
									)
								);
							} else if (req.offset){
								return this.collection.getDatum(
									interval, 
									req.offset
								).get(req.field);
							} else {
								return datum.get(req.field);
							}
						} else {
							throw new Error('Unknown requirement');
						}
					}
				));

				value = exp.calculate(...reqs);

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

	async calcAll(formula){
		return Promise.all(this.collection.getKeys().map(
			async (interval) => ({
				interval,
				value: await this.calc(formula, interval)
			})
		));
	}

	async dump(interval, formulas = null){
		if (!formulas){
			formulas = Object.keys(this.formulas);
		}

		return formulas.reduce(
			async (prom, formula) => {
				const [agg, value] = await Promise.all([
					prom,
					this.calc(formula, interval)
				]);

				agg[formula] = value;

				return agg;
			},
			Promise.resolve({})
		);
	}
}

module.exports = {
	Calculator
};
