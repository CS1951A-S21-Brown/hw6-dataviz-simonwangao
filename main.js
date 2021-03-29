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

let cur_start_year = 1980;
let cur_end_year = 2020;
let slider = new Slider('#year', {});

let cur_region = "NA";

let cur_genre = "Strategy";

// Load data from billboard.csv file
d3.csv("./data/video_games.csv").then(function(d) {
    data = d;
    updateDashboard();
});

// Update cur_start_year and cur_end_year on slideStop of range slider
slider.on("slideStop", function(range) {
    cur_start_year = range[0];
    cur_end_year = range[1];
    setGraph2();
});

/**
 * Updates cur attribute
 */
function setAttr1() {
    // graph 1
    graph1_input_year = document.getElementById("attrInput1").value;
    setGraph1();
 }

function selectChange() {
    cur_region = document.getElementById("Regions").value;
    setGraph2();
}

function selectChange2() {
    cur_genre = document.getElementById("Genres").value;
    setGraph3();
}

/**
 * Updates dashboard scatterplot and barplot after change in date or cur_attr
 */
function updateDashboard() {
    setGraph1();
    setGraph2();
    setGraph3();
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


