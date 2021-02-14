
const {Expressor} = require('./expressor.js');

class Drawer extends Expressor {
	constructor(calculator, drawings = {}){
		super('line', calculator, drawings);
	}
}

module.exports = {
	Drawer
};
