
class Plotter {
	constructor(calculator, plots = {}){
		this.plots = plots;
		this.calculator = calculator;

		calculator.addExpressor('plot', this);
	}

	async require(req){
		return this.drawer.require(req);
	}
}

module.exports = {
	Plotter
};
