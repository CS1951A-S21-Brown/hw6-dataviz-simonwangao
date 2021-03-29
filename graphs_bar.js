// set the dimensions and margins of the graph
var width3 = graph_1_width / 2 + 100,
    height3 = graph_1_height;

var col3;

let svg3 = d3.select("#plot3")
    .append("svg")
    .attr("width", width3 + margin.left + margin.right)     // HINT: width
    .attr("height", height3 + margin.top + margin.bottom)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x3 = d3.scaleLinear()
    .range([0, width3]);

let y3 = d3.scaleBand()
    .range([0, height3])
    .padding(0.2);
svg3.append("g")
    .call(d3.axisLeft(y3));


function setGraph3() {
    d3.select("#plot3").selectAll("g > *").remove();

    // Add x-axis label
    svg3.append("text")
    .attr("transform", `translate(${(width3) / 2}, ${height3 + 38})`)
    .style("text-anchor", "middle")
    .text("Global Sales for This Genre (millions)");

    // Add y-axis label
    svg3.append("text")
    .attr("transform", `translate(-220, ${height3 / 2})`)
    .style("text-anchor", "middle")
    .text("Publisher");

    // Add title
    svg3.append("text")
    .attr("transform", `translate(${width3 / 2}, -15)`)
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Top " + NUM_EXAMPLES + " Publishers for Game Genre <" + cur_genre + ">");

    // get data
    var res = cleanData3(data);

    x3.domain([0, d3.max(res, d => d.value) + 1]);
    svg3.append("g")
        .attr("transform", "translate(0," + height3 + ")")
        .call(d3.axisBottom(x3))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    y3.domain(res.map(d => d.key));

    var colors = ["#EE0C0C"];
    for (i = 0; i < res.length - 1; i++)
        colors.push("#B3B3B3");

    let color3 = d3.scaleOrdinal()
        .domain(res.map(d => d.key))
        .range(colors);
    
    col3 = color3;
    
    svg3.append("g")
        .call(d3.axisLeft(y3).tickSize(0).tickPadding(10));

    let bars = svg3.selectAll("rect").data(res);

    bars.enter()
        .append("rect")
        .on("mouseover", mouseover_bar)
        .on("mouseout", mouseout_bar)
        .merge(bars)
        .transition()
        .duration(750)
        .attr("fill", d => color3(d.key))
        .attr("x", x3(0))
        .attr("y", d => y3(d.key))
        .attr("width", d => x3(d.value))
        .attr("height", y3.bandwidth())
        .attr("id", d => `bar-${d.key.replace(/\s+/g, '')}`);
    
    let counts = svg3.append("g").selectAll("text").data(res);
    counts.enter()
        .append("text")
        .merge(counts)
        .style("font", "12px times")
        .transition()
        .duration(750)
        .attr("x", d => x3(d.value) + 5)
        .attr("y", d => y3(d.key) + 13)
        .style("text-anchor", "start")
        .text(d => d.value.toFixed(2));
}

function cleanData3(data) {
    var res_dict = {}; // key is publisher
    for (i = 0; i < data.length; i++) {
        if (data[i].Genre === cur_genre) {
            data[i].Global_Sales = parseFloat(data[i].Global_Sales);
            if (res_dict[data[i].Publisher] === undefined)
                res_dict[data[i].Publisher] = data[i].Global_Sales;
            else
                res_dict[data[i].Publisher] += data[i].Global_Sales;
        }
    }

    var ordered_keys = Object.keys(res_dict).sort(function(a, b) {
        return res_dict[b] - res_dict[a];
    });

    ordered_keys = ordered_keys.slice(0, NUM_EXAMPLES);

    var res = [];
    for (i = 0; i < ordered_keys.length; i++) {
        tmp = {}
        tmp["key"] = ordered_keys[i];
        tmp["value"] = res_dict[ordered_keys[i]];
        res.push(tmp);
    }
    return res;
}

// Darken bar fill in barplot on mouseover
let mouseover_bar = function(d) {
    svg3.select(`#bar-${d.key.replace(/\s+/g, '')}`).attr("fill", function(d) {
        return darkenColor(col3(d.key), 0.5);
    });
};

// Restore bar fill to original color on mouseout
let mouseout_bar = function(d) {
    svg3.select(`#bar-${d.key.replace(/\s+/g, '')}`).attr("fill", function(d) {
        return col3(d.key);
    });
};
