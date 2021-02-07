

function average(arr){
	return arr.reduce((agg, val) => agg + val, 0) / arr.length;
}

function max(arr){
	return arr.reduce((agg, val) => {
		if (agg > val){
			return agg;
		} else {
			return val;
		}
	});
}

function min(arr){
	return arr.reduce((agg, val) => {
		if (agg < val){
			return agg;
		} else {
			return val;
		}
	});
}

module.exports = {
	Calculator
};
