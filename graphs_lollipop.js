// set the dimensions and margins of the graph
var width = graph_1_width / 2 + 100,
    height = graph_1_height;


// append the svg object to the body of the page
var svg = d3.select("#plot1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var col;

// Parse the Data
function setGraph1() {
    d3.selectAll("g > *").remove();

    // Add x-axis label
    svg.append("text")
    .attr("transform", `translate(${(width) / 2}, ${height + 38})`)
    .style("text-anchor", "middle")
    .text("Global Sales (millions)");

    // Add y-axis label
    svg.append("text")
    .attr("transform", `translate(-220, ${height / 2})`)
    .style("text-anchor", "middle")
    .text("Game");

    var str;
    if (graph1_input_year === "")
        str = "of All Time";
    else
        str = "in Year " + graph1_input_year;

    // Add title
    svg.append("text")
    .attr("transform", `translate(${width / 2}, -15)`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 20)
    .text("Top " + NUM_EXAMPLES + " Video Games " + str);

    // check year is valid
    if (!(graph1_input_year === "") && !validYear(graph1_input_year)) {
        alert("Input year is not Valid!");
        return ;
    }

    let dat = cleanData(data);
    for (i = 0; i < dat.length; i++) {
        dat[i].Global_Sales = parseFloat(dat[i].Global_Sales);
    }
    if (dat.length === 0) {
        alert("No game in this year!");
        return ;
    }

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, d3.max(dat, d => d.Global_Sales)])
        .range([ 0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
    .range([0, height])
    .domain(dat.map(d => d.Name + ' (' + d.Platform + ')'))
    .padding(1);
    svg.append("g")
    .call(d3.axisLeft(y));

    let color = d3.scaleOrdinal()
        .domain(dat.map(d => d.Name + ' (' + d.Platform + ')'))
        .range(d3.quantize(d3.interpolateHcl("#2081C3", "#BED8D4"), NUM_EXAMPLES));
    col = color;

    // Lines
    let lines = svg.selectAll("myline").data(dat);
    lines
    .enter()
    .append("line")
        .merge(lines)
        .transition()
        .duration(750)
        .attr("x1", d => x(d.Global_Sales))
        .attr("x2", x(0))
        .attr("y1", d => y(d.Name + ' (' + d.Platform + ')'))
        .attr("y2", d => y(d.Name + ' (' + d.Platform + ')'))
        .attr("stroke", "grey");

    // Circles
    let circles = svg.selectAll("mycircle").data(dat);
    circles
    .enter()
    .append("circle")
        .on("mouseover", mouseover_plot)
        .on("mouseout", mouseout_plot)
        .merge(circles)
        .transition()
        .duration(750)
        .attr("fill", d => color(d.Name + ' (' + d.Platform + ')'))
        .attr("cx", d => x(d.Global_Sales))
        .attr("cy", d => y(d.Name + ' (' + d.Platform + ')'))
        .attr("r", "9")
        .attr("id", d => `circle-${d.Rank}`);
    
    let counts = svg.append("g").selectAll("text").data(dat);
    counts.enter()
        .append("text")
        .merge(counts)
        .style("font", "12px times")
        .transition()
        .duration(750)
        .attr("x", d => x(d.Global_Sales) + 12)
        .attr("y", d => y(d.Name + ' (' + d.Platform + ')') + 5)
        .style("text-anchor", "start")
        .text(d => d.Global_Sales);
}

/**
 * Clean the data for required input
 * require graph1_input_year in main.js
 */
function cleanData(d) {
    var new_data;
    if (graph1_input_year === "") {
        new_data = d;
    } else {
        new_data = [];
        for (i = 0; i < d.length; i++) {
            if (d[i].Year === graph1_input_year) {
                new_data.push(d[i]);
            }
        }
    }

    // sort
    new_data.sort(function(a, b){return b.Global_Sales - a.Global_Sales});
    return new_data.slice(0, NUM_EXAMPLES);
}

/**
 * Check if the year is valid
 * year is a string
 */
function validYear(year) {
    var parsed = parseInt(year, 10);
    if (isNaN(parsed))
        return false;
    else
        return true;
}

// Darken bar fill in barplot on mouseover
let mouseover_plot = function(d) {
    svg.select(`#circle-${d.Rank}`).attr("fill", function(d) {
        return darkenColor(col(d.Name + ' (' + d.Platform + ')'), 0.5);
    });
};

// Restore bar fill to original color on mouseout
let mouseout_plot = function(d) {
    svg.select(`#circle-${d.Rank}`).attr("fill", function(d) {
        return col(d.Name + ' (' + d.Platform + ')');
    });
};
