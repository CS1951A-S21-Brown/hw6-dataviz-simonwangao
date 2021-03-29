// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 50, left: 300};
const NUM_EXAMPLES = 10;

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

// Mine
let data;
let graph1_input_year = "";

// Load data from billboard.csv file
d3.csv("./data/video_games.csv").then(function(d) {
    data = d;
    updateDashboard();
    // ? add more
});

/**
 * Updates cur attribute
 */
function setAttr() {
    // graph 1
    graph1_input_year = document.getElementById("attrInput1").value;

    updateDashboard();
 }

/**
 * Updates dashboard scatterplot and barplot after change in date or cur_attr
 */
function updateDashboard() {
    setGraph1();
}

/**
 * Converts a text to sentence case
 */
function sentenceCase(word) {
    return `${word[0].toUpperCase()}${word.substring(1)}`;
}

/**
 * Returns a darker shade of a given color
 */
function darkenColor(color, percentage) {
    return d3.hsl(color).darker(percentage);
}


