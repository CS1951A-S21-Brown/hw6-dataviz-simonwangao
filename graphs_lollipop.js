// set the dimensions and margins of the graph
var width1 = graph_1_width / 2 + 100,
    height1 = graph_1_height;


// append the svg object to the body of the page
var svg1 = d3.select("#plot1")
    .append("svg")
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", height1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var col;

// Parse the Data
function setGraph1() {
    d3.select("#plot1").selectAll("g > *").remove();

    // Add x-axis label
    svg1.append("text")
    .attr("transform", `translate(${(width1) / 2}, ${height1 + 38})`)
    .style("text-anchor", "middle")
    .text("Global Sales (millions)");

    // Add y-axis label
    svg1.append("text")
    .attr("transform", `translate(-220, ${height1 / 2})`)
    .style("text-anchor", "middle")
    .text("Game");

    var str;
    if (graph1_input_year === "")
        str = "of All Time";
    else
        str = "in Year " + graph1_input_year;

    // Add title
    svg1.append("text")
    .attr("transform", `translate(${width1 / 2}, -15)`)
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Top " + NUM_EXAMPLES + " Video Games " + str);

    // check year is valid
    if (!(graph1_input_year === "") && !validYear(graph1_input_year)) {
        alert("Input year is not Valid!");
        return ;
    }

    let dat = cleanData1(data);
    for (i = 0; i < dat.length; i++) {
        dat[i].Global_Sales = parseFloat(dat[i].Global_Sales);
    }
    if (dat.length === 0) {
        alert("No game in this year!");
        return ;
    }

    // Add X axis
    var x1 = d3.scaleLinear()
        .domain([0, d3.max(dat, d => d.Global_Sales)])
        .range([ 0, width1]);
    svg1.append("g")
        .attr("transform", "translate(0," + height1 + ")")
        .call(d3.axisBottom(x1))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    var y1 = d3.scaleBand()
    .range([0, height1])
    .domain(dat.map(d => d.Name + ' (' + d.Platform + ')'))
    .padding(1);
    svg1.append("g")
    .call(d3.axisLeft(y1));

    let color1 = d3.scaleOrdinal()
        .domain(dat.map(d => d.Name + ' (' + d.Platform + ')'))
        .range(d3.quantize(d3.interpolateHcl("#DB2763", "#12EAEA"), NUM_EXAMPLES));
    col = color1;

    // Lines
    let lines = svg1.selectAll("myline").data(dat);
    lines
    .enter()
    .append("line")
        .merge(lines)
        .transition()
        .duration(750)
        .attr("x1", d => x1(d.Global_Sales))
        .attr("x2", x1(0))
        .attr("y1", d => y1(d.Name + ' (' + d.Platform + ')'))
        .attr("y2", d => y1(d.Name + ' (' + d.Platform + ')'))
        .attr("stroke", "grey");

    // Circles
    let circles = svg1.selectAll("mycircle").data(dat);
    circles
    .enter()
    .append("circle")
        .on("mouseover", mouseover_plot)
        .on("mouseout", mouseout_plot)
        .merge(circles)
        .transition()
        .duration(750)
        .attr("fill", d => color1(d.Name + ' (' + d.Platform + ')'))
        .attr("cx", d => x1(d.Global_Sales))
        .attr("cy", d => y1(d.Name + ' (' + d.Platform + ')'))
        .attr("r", "9")
        .attr("id", d => `circle-${d.Rank}`);
    
    let counts = svg1.append("g").selectAll("text").data(dat);
    counts.enter()
        .append("text")
        .merge(counts)
        .style("font", "12px times")
        .transition()
        .duration(750)
        .attr("x", d => x1(d.Global_Sales) + 12)
        .attr("y", d => y1(d.Name + ' (' + d.Platform + ')') + 5)
        .style("text-anchor", "start")
        .text(d => d.Global_Sales);
}

/**
 * Clean the data for required input
 * require graph1_input_year in main.js
 */
function cleanData1(d) {
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
    svg1.select(`#circle-${d.Rank}`).attr("fill", function(d) {
        return darkenColor(col(d.Name + ' (' + d.Platform + ')'), 0.5);
    });
};

// Restore bar fill to original color on mouseout
let mouseout_plot = function(d) {
    svg1.select(`#circle-${d.Rank}`).attr("fill", function(d) {
        return col(d.Name + ' (' + d.Platform + ')');
    });
};
