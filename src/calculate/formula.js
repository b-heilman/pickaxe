

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
            /** I don't think this cares
            if(temp_ker/self_ker<max_diff){
                break;
            }**/

            kerValue += ker * arr[i];
            kerNormalized += ker;
        }
        
       return kerValue / kerNormalized;
    }
}

module.exports = {
	average,
	max,
	min
};
