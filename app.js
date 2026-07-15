const svg = d3.select("#atlas");

const width = window.innerWidth;
const height = window.innerHeight;

svg
    .attr("viewBox", `0 0 ${width} ${height}`);

fetch("/api/workflow")
    .then(r => r.json())
    .then(data => {

        data.sort((a, b) => a.order - b.order);

        const g = svg.append("g");

        const xStart = 120;
        const xEnd = width - 120;

        const y = height / 2;

        // rivière

        g.append("line")
            .attr("x1", xStart)
            .attr("x2", xEnd)
            .attr("y1", y)
            .attr("y2", y)
            .attr("stroke", "#2b5cff")
            .attr("stroke-width", 4)
            .attr("opacity", .35);

        const scale = d3.scaleLinear()
            .domain([1, data.length])
            .range([xStart, xEnd]);

        g.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d, i) => scale(i + 1))
            .attr("cy", y)
            .attr("r", 18)
            .attr("fill", "#ffffff");

        g.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", (d, i) => scale(i + 1))
            .attr("y", y + 42)
            .attr("text-anchor", "middle")
            .attr("fill", "#cccccc")
            .attr("font-size", 13)
            .text(d => d.name);

    });
