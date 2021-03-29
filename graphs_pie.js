// set the dimensions and margins of the graph
var width2 = 550;
var height2 = 450;
var padding = 40;

// The radius of the pieplot is half the width or half the height (smallest one)
var radius = Math.min(width2, height2) / 2 - padding;

var attr_dict = {"NA": "NA_Sales", "EU": "EU_Sales", "JP": "JP_Sales", "Other": "Other_Sales", "Global": "Global_Sales"};

var col2;

var total;

// append the svg object to the div called 'my_dataviz'
var svg2 = d3.select("#plot2")
    .append("svg")
    .attr("width", width2)
    .attr("height", height2)
    .append("g")
    .attr("transform", `translate(${width2 / 2}, ${height2 / 2})`);

function setGraph2() {
    d3.select("#plot2").selectAll("g > *").remove();
    // get data
    var res_dict = cleanData2(data);

    var ordered_keys = Object.keys(res_dict).sort(function(a, b) {
        return res_dict[b] - res_dict[a];
    });

    total = 0;
    for (i = 0; i < ordered_keys.length; i++)
        total += res_dict[ordered_keys[i]];

    // Add title
    svg2.append("text")
    .attr("transform", `translate(${width2 / 2 - 280}, -200)`)
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Most Popular Game Genre (" + cur_region + ") Between Year " + cur_start_year + "-" + cur_end_year);

    let color2 = d3.scaleOrdinal()
        .domain(ordered_keys)
        .range(d3.quantize(d3.interpolateHcl("#DB2763", "#12EAEA"), ordered_keys.length));
    
    col2 = color2;
    
    var pie = d3.pie()
        .value(d => d.value)
        .sort(function(a, b) {return d3.descending(a.value, b.value);} );
    
    var data_ready = pie(d3.entries(res_dict));
    var u = svg2.selectAll("path").data(data_ready);

    u
    .enter()
    .append('path')
    .on("mouseover", mouseover_pie)
    .on("mouseout", mouseout_pie)
    .merge(u)
    .transition()
    .duration(750)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', d => color2(d.data.key))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.97)
    .attr("id", d => `sector-${d.data.key}`);

    // The arc generator
    var arc = d3.arc()
    .innerRadius(radius * 0.5)         // This is the size of the donut hole
    .outerRadius(radius * 0.8);

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
    .innerRadius(radius * 0.95)
    .outerRadius(radius * 0.95);

    svg2
    .selectAll('allPolylines')
    .data(data_ready)
    .enter()
    .append('polyline')
        .attr("stroke", "#5E5B5A")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function(d) {
        var posA = arc.centroid(d); // line insertion in the slice
        var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 1.02 * (midangle < Math.PI || midangle >= 1.97 * Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC];
        });
    
    svg2
    .selectAll('allLabels')
    .data(data_ready)
    .enter()
    .append('text')
        .style('fill', '#5E5B5A')
        .text(d => d.data.key)
        .style("font", "12px times")
        .attr('transform', function(d) {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = radius * 1.02 * (midangle < Math.PI || midangle >= 1.97 * Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function(d) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return (midangle < Math.PI || midangle >= 1.97 * Math.PI ? 'start' : 'end');
        });

    //u.exit().remove();
}

function cleanData2(data) {
    var res_dict = {};
    for (i = 0; i < data.length; i++) {
        if (data[i].Year >= cur_start_year && data[i].Year <= cur_end_year) {
            // need this entry
            data[i][attr_dict[cur_region]] = parseFloat(data[i][attr_dict[cur_region]]);
            if (res_dict[data[i].Genre] === undefined)
                res_dict[data[i].Genre] = data[i][attr_dict[cur_region]];
            else
                res_dict[data[i].Genre] += data[i][attr_dict[cur_region]];
        }
    }

    return res_dict;
}

// Set up reference to tooltip
let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0.9);

// Darken bar fill on mouseover
let mouseover_pie = function(d) {
    svg2.select(`#sector-${d.data.key}`).attr("fill", function(d) {
        return darkenColor(col2(d.data.key), 0.8);
    });

    // tooltip
    let color_span = `<span style="color: ${col2(d.data.key)};">`;
    let html = `${d.data.key}<br/>
                ${color_span}${d.data.value.toFixed(2)} millions</span><br/>
                Percentage: ${color_span}${(100 * d.data.value / total).toFixed(2)}%</span>`;

    // Show the tooltip and set the position relative to the event X and Y location
    tooltip.html(html)
        .style("left", `${(d3.event.pageX) + 30}px`)
        .style("top", `${(d3.event.pageY) - 100}px`)
        .style("box-shadow", `2px 2px 5px ${col2(d.data.key)}`)
        .transition()
        .duration(200)
        .style("opacity", 0.8)
};

// Restore bar fill to original color on mouseout
let mouseout_pie = function(d) {
    svg2.select(`#sector-${d.data.key}`).attr("fill", function(d) {
        return col2(d.data.key);
    });
    tooltip.transition()
        .duration(200)
        .style("opacity", 0);
};
