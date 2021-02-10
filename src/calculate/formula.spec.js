
const {expect} = require('chai');

describe('calculate/formula', function() {
	const sut = require('./formula.js');

	describe('.average', function(){
		it('should work', async function(){
			expect(
				sut.average([1,2,3,4,5])
			).to.equal(3);
		});
	});

	describe('.max', function(){
		it('should work as the first number', async function(){
			expect(
				sut.max([5,4,3,2])
			).to.equal(5);
		});

		it('should work as the last number', async function(){
			expect(
				sut.max([2,3,4,5])
			).to.equal(5);
		});

		it('should work as the middle number', async function(){
			expect(
				sut.max([2,5,3,4])
			).to.equal(5);
		});
	});

	describe('.min', function(){
		it('should work as the first number', async function(){
			expect(
				sut.min([2,3,4,5])
			).to.equal(2);
		});

		it('should work as the last number', async function(){
			expect(
				sut.min([5,4,3,2])
			).to.equal(2);
		});

		it('should work as the middle number', async function(){
			expect(
				sut.min([5,3,2,4])
			).to.equal(2);
		});
	});

	describe('.difference', function(){
		it('should work with min number first', async function(){
			expect(
				sut.difference(2, 4)
			).to.equal(2);
		});

		it('should work with max number first', async function(){
			expect(
				sut.difference(4, 2)
			).to.equal(2);
		});
	});

	describe('.kernelFactory', function(){
		const values = [6, 7, 3, 2, 1, 4];

		describe('gaussian', function(){
			let fn = null;

			beforeEach(function(){
				fn = sut.kernelFactory('gaussian', 1);
			});

			it('should work', function(){
				expect(parseInt(fn(values)*1000))
				.to.equal(2802);
			});
		});

		describe('logistic', function(){
			let fn = null;

			beforeEach(function(){
				fn = sut.kernelFactory('logistic', 1);
			});

			it('should work', function(){
				expect(parseInt(fn(values)*1000))
				.to.equal(2818);
			});
		});
		
		describe('uniform', function(){
			let fn = null;

			beforeEach(function(){
				fn = sut.kernelFactory('uniform', 1);
			});

			it('should work', function(){
				expect(parseInt(fn(values)*1000))
				.to.equal(2500);
			});
		});
		
		describe('triangular', function(){
			let fn = null;

			describe('with scale of 1', function(){
				beforeEach(function(){
					fn = sut.kernelFactory('triangular', 1);
				});

				it('should work', function(){
					expect(parseInt(fn(values)*1000))
					.to.equal(4000);
				});
			});
			
			describe('with scale of 2', function(){
				beforeEach(function(){
					fn = sut.kernelFactory('triangular', 2);
				});

				it('should work', function(){
					expect(parseInt(fn(values)*1000))
					.to.equal(3000);
				});
			});
		});
		
		describe('quartic', function(){
			let fn = null;

			describe('with scale of 1', function(){
				beforeEach(function(){
					fn = sut.kernelFactory('quartic', 1);
				});

				it('should work', function(){
					expect(parseInt(fn(values)*1000))
					.to.equal(4000);
				});
			});
			
			describe('with scale of 2', function(){
				beforeEach(function(){
					fn = sut.kernelFactory('quartic', 2);
				});

				it('should work', function(){
					expect(parseInt(fn(values)*1000))
					.to.equal(2920);
				});
			});
		});
		
		describe('triweight', function(){
			let fn = null;

			describe('with scale of 1', function(){
				beforeEach(function(){
					fn = sut.kernelFactory('triweight', 1);
				});

				it('should work', function(){
					expect(parseInt(fn(values)*1000))
					.to.equal(4000);
				});
			});
			
			describe('with scale of 2', function(){
				beforeEach(function(){
					fn = sut.kernelFactory('triweight', 2);
				});

				it('should work', function(){
					expect(parseInt(fn(values)*1000))
					.to.equal(3109);
				});
			});
		});
		
		describe('cosine', function(){
			let fn = null;

			describe('with scale of 1', function(){
				beforeEach(function(){
					fn = sut.kernelFactory('cosine', 1);
				});

				it('should work', function(){
					expect(parseInt(fn(values)*1000))
					.to.equal(4000);
				});
			});
			
			describe('with scale of 2', function(){
				beforeEach(function(){
					fn = sut.kernelFactory('cosine', 2);
				});

				it('should work', function(){
					expect(parseInt(fn(values)*1000))
					.to.equal(2757);
				});
			});
		});
		
		describe('tricube', function(){
			let fn = null;

			describe('with scale of 1', function(){
				beforeEach(function(){
					fn = sut.kernelFactory('tricube', 1);
				});

				it('should work', function(){
					expect(parseInt(fn(values)*1000))
					.to.equal(4000);
				});
			});
			
			describe('with scale of 2', function(){
				beforeEach(function(){
					fn = sut.kernelFactory('tricube', 2);
				});

				it('should work', function(){
					expect(parseInt(fn(values)*1000))
					.to.equal(2796);
				});
			});
		});
		
		describe('silverman', function(){
			let fn = null;

			beforeEach(function(){
				fn = sut.kernelFactory('silverman', 1);
			});

			it('should work', function(){
				expect(parseInt(fn(values)*1000))
				.to.equal(2517);
			});
		});
	});
});
