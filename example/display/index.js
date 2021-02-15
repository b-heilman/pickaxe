
import * as d3 from 'd3';

document.body.innerHTML = `
<style>
body {
  background: #00151c;
  margin: 0px;
}
#dashboard {
  background: #0e3040;
  color: #67809f;
  margin: 0px;
}
</style>

<section id='dashboard'
	style='border: 1px solid black'
	></section>
`;

const {content, graphs} = require('./calculated.json');

function createChart(raw, {title, lines, points}){
	const unique = new Set();
	const values = new Set();

	lines.forEach(l => {
		unique.add(l.field);
	});

	if (points){
		points.forEach(p => {
			values.add(p.field);
			unique.add(p.value);
		});
	}

	const numbers = Array.from(unique);
	const fields = Array.from(values);

	let yMax = null;
	let yMin = null;

	const data = raw.map(
		d => {
			const vals = d.values;

			const datum = {
				date: Date.parse(d.interval)
			};

			return numbers.reduce(
				(agg, key) => {
					const v = Number(vals[key]);

					if (yMax === null || v > yMax){
						yMax = v;
					}

					if (yMin === null || v < yMin){
						yMin = v;
					}

					agg[key] = v;

					return fields.reduce(
						(agg, key) => {
							agg[key] = vals[key];

							return agg;
						},
						agg
					);
				},
				datum
			);
		}
	);

	// const square = d3.selectAll('rect');

	// square.style('fill', 'orange');
	const margin = { top: 20, right: 40, bottom: 50, left: 20 };
	const width = 800;
	const height = 400; 

 	const svg = d3
    .select('#dashboard')
    .append('svg')
    .attr('width', width + margin['left'] + margin['right'])
    .attr('height', height + margin['top'] + margin['bottom'])
    // .call(responsivefy)
    .append('g')
    .attr('transform', `translate(${margin['left']},  ${margin['top']})`);

	const xMin = d3.min(data, d => {
		return d['date'];
	});
	
	const xMax = d3.max(data, d => {
		return d['date'];
	});

	// scales for the charts
	const xScale = d3
	.scaleTime()
	.domain([xMin, xMax])
	.range([0, width]);
	
	const yScale = d3
	.scaleLinear()
	.domain([yMin - 5, yMax])
	.range([height, 0]);

	svg.append('text')      // text label for the x axis
        .attr('x',0)
        .attr('y',0)
        //.style('text-anchor', 'middle')
        .text(title);

    const g = svg.append('g')
    	.attr('transform', `translate(0, 5)`)


    // x-axis
	g.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(
			d3.axisBottom(xScale)
			.ticks(20)
			.tickSize(-height)
		)
		.selectAll('text')
	    .attr('y', 0)
	    .attr('x', 5)
	    .attr('dy', '.35em')
	    .attr('transform', 'rotate(90)')
	    .style('text-anchor', 'start');

	// y-axis
	g.append('g')
		.attr('transform', `translate(${width}, 0)`)
		.call(d3.axisRight(yScale));

	lines.map(line => {
		const field = line.field;

		const path = d3
		.line()
		.x(d => xScale(d.date))
		.y(d => yScale(d[field]));

		// Append the path and bind data
		g.append('path')
		.data([data])
		.style('fill', 'none')
		.attr('id', 'priceChart')
		.attr('stroke', line.color)
		.attr('stroke-width', '1.5')
		.attr('d', path);
	});

	if (points){
		console.log('has points');
		points.map(series => {
			const field = series.field;
			const value = series.value;

			console.log(data);
			const filtered = data.filter(d => d[field]);
			console.log('filtered', filtered);
			const sub = g.append('g');

			sub.selectAll('circle')
			.data(filtered)
			.join('circle')
			.attr('r', 2.5)
			.attr('cx', d => xScale(d.date))
			.attr('cy', d => yScale(d[value]))
			.style('fill', series.color)
			.style('opacity', '.5');
		});
	}
}

graphs.map(graph => createChart(content, graph));
