
class Drawer {
	constructor(calculator, drawings = {}){
		this.drawings = drawings;
		this.calculator = calculator;

		calculator.addExpressor('plot', this);
	}

	async require(req){
		const subFormula = req.name;

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
		} else {
			return super.require(req);
		}
	}
}

module.exports = {
	Drawer
};
