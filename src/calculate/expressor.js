
class Expressor {
	constructor(name, calculator, expressions = {}){
		this.calculator = calculator;
		this.expressions = expressions;

		calculator.addExpressor(name, this);
	}

	addSeries(opts, factory){
		return opts.map(
			opt => factory(opt).map(
				settings => this.addFormula(settings)
			)
		);
	}

	addExpression(settings){
		this.expressions[settings.formula] = {
			requirements: settings.requirements,
			express: settings.express
		};
	}

	async calc(interval, exp){
		let args = null;

		if (exp.pattern){
			if (exp.offset){
				interval = this.calculator.collection.getOffset(interval, exp.offset);
			}

			args = await exp.pattern.reduce(
				async (agg, req) => {
					let valid = true;
					const arr = await agg;

					if (interval){
						do {
							const value = await this.calculator.require(interval, req);

							if (req.test(value)){
								// so I know the interval... what do I store?
								arr.push(
									await this.calculator.require(interval, req.value)
								);
								valid = false;
							}

							interval = this.calculator.collection.prevInterval(interval);
						} while(valid && interval);
					}

					if (valid){
						// I didn't find a match, so we need to fail this variable
						arr.push(null);
					}

					return arr;
				},
				[]
			);
		} else {
			args = await Promise.all(exp.requirements.map(
				req => this.calculator.require(interval, req)
			));
		}

		return exp.express(...args);
	}

	async calculate(expression, interval){
		const exp = this.expressions[expression];
		const datum = this.calculator.collection.getDatum(interval);
		let value = datum.get(expression);

		if (exp && datum){
			if (value === undefined){
				value = await this.calc(interval, exp);

				datum.set(expression, value);
			}

			return value;
		} else if (!exp){
			throw new Error(`unknown expression: ${expression}`);
		} else {
			console.log('debug', this.collection.getKeys());
			throw new Error(`unknown datum: ${interval}`);
		}
	}

	getExpressions(){
		return Object.keys(this.expressions);
	}

	hasExpression(expression){
		return expression in this.expressions;
	}

	async express(interval, req){
		const subFormula = req.name;

		if (subFormula){
			const size = req.size - 1;

			if (size > 1){
				return Promise.all(
					this.collection.getRange(
						interval,
						size,
						req.offset
					).map(sub => this.calculate(
						subFormula,
						sub
					))
				);
			} else if (req.offset){
				return this.calculate(
					subFormula,
					this.calculator.collection.getOffset(
						interval,
						req.offset
					)
				);
			} else {
				return this.calculate(
					subFormula,
					interval
				);
			}
		}
	}
}

module.exports = {
	Expressor
};
