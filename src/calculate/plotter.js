
const {Expressor} = require('./expressor.js');

class Plotter extends Expressor {
	constructor(calculator, drawings = {}){
		super('point', calculator, drawings);
	}
}

module.exports = {
	Plotter
};
