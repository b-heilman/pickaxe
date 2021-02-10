

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

// this kernel method is optimized for my use case.  I pulled influence from
// https://github.com/muonsw/ssci/blob/master/src/smooth/smoothKernel2.js
const kernels = {
	gaussian: function(x1, x2, scale){
		return (1/Math.sqrt(2*Math.PI))*Math.exp(-(Math.pow((x1 - x2),2) / (2*Math.pow(scale,2))));
	},

	logistic: function(x1 , x2 , scale) {
		const v1 = (x1 - x2) / scale;

		return 1 / (Math.exp(v1) + Math.exp(-v1));
	},

	uniform: function(x1 , x2 , scale) {
		if (Math.abs((x1 - x2) / scale) > 1) {
			return 0;
		} else {
			return 1 / 2;
		}
	},

	triangular: function(x1, x2, scale) {
		const v1 = Math.abs((x1 - x2) / scale);

		if (v1 > 1) {
			return 0;
		} else {
			return 1 - v1;
		}
	},

	quartic: function(x1, x2, scale) {
		const v1 = (x1 - x2) / scale;

		if (Math.abs(v1) > 1) {
			return 0;
		} else {
			return (15 / 16) * Math.pow((1 - Math.pow((v1), 2)), 2);
		}
	},

	triweight: function(x1, x2, scale) {
		const v1 = (x1 - x2) / scale;

		if (Math.abs(v1) > 1) {
			return 0;
		} else {
			return (35 / 32) * Math.pow((1 - Math.pow(v1, 2)), 3);
		}
	},

	cosine: function(x1, x2, scale) {
		const v1 = (x1 - x2) / scale;
		
		if (Math.abs(v1) > 1) {
			return 0;
		} else {
			return (Math.PI / 4) * Math.cos((Math.PI / 2) * v1);
		}
	},

	tricube: function(x1, x2, scale) {
		const v1 = Math.abs((x1 - x2) / scale);
		
		if (v1 > 1) {
			return 0;
		} else {
			return (70 / 81) * Math.pow((1 - Math.pow(v1, 3)), 3);
		}
	},

	silverman: function(x1, x2, scale){
		var v1 = Math.abs((x2-x1)/scale);
		
		return 0.5 * Math.exp(-v1/Math.SQRT2) * Math.sin(v1/Math.SQRT2 + Math.PI/4);
	}
};

function kernelFactory(method, scale=1){
	const kernelFn = kernels[method];

	return function kernelFactoryFn(arr){
		const c = arr.length;
		const cur = c-1;

		let kerValue = 0;
		let kerNormalized = 0;
		
		//Kernel for point=i
		const tker = kernelFn(cur, cur, scale);
		kerValue += tker * arr[cur];
		kerNormalized += tker;
		
		//Kernel for lower points
		for(let i=cur-1; i>-1; i--){
			const ker = kernelFn(cur, i, scale);

			kerValue += ker * arr[i];
			kerNormalized += ker;
		}
		
	   return kerValue / kerNormalized;
	};
}

function difference(x1, x2){
	return Math.abs(x1-x2);
}

module.exports = {
	average,
	max,
	min,
	difference, 
	kernelFactory
};
