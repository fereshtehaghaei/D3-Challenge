// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 650;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  };

  // Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg
    .append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

  // Load data from data.csv
d3.csv("assets/data/data.csv").then(function(Data) {


// Convert/Cast data values for poverty and healthcare to a number
Data.forEach(function(d) {
  d.poverty = +d.poverty
  d.healthcare  = +d.healthcare;
});

 // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
 var xBandScale = d3.scaleBand()
    .domain(Data.map(d => d.healthcare))
    .range([0, chartWidth])
    .padding(0.1);

 // Create a linear scale for the vertical axis.
 var yLinearScale = d3
    .scaleLinear()
    .domain([0, d3.max(Data, d => d.healthcare)*1.2])
    .range([chartHeight, 0]);

// Create a linear scale for the horizontal axis.
var xLinearScale = d3
    .scaleLinear()
    .domain([
              d3.max(Data, d => d.poverty) * 1.2,
              d3.min(Data, d => d.healthcare) * 1.8])

    .range([chartHeight, 0]);

 // Create two new functions passing our scales in as arguments
// These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

// Append two SVG group elements to the chartGroup area & create bottom & left axes inside of them
//******** Append X and Y ********/
  chartGroup
    .append("g")
    .call(leftAxis);

  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
  
 

  //*******************************/
  //******* SCATTER PLOT **********/
  //*******************************/
  // Create one SVG rectangle per piece of Data
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll("#scatter")
            .data(Data)
            .enter()
            .append("rect")
            .attr("class", "#scatter")
            .attr("x", d => xBandScale(d.healthcare))
            .attr("y", d => yLinearScale(d.poverty))
            .attr("width", xBandScale.bandwidth())
            .attr("height", d => chartHeight - yLinearScale(d.poverty))
            .transition()
            .duration(1500)
            .delay(1000)
            .attr("width", 25)
            .transition()
            .duration(1000)
            //.delay(1000)
            .attr("width", 17)
            .transition()
            .delay(500)
            .attr("fill", "purple");


// Catching erros in console without having to catch at every line
}).catch(function(error) {
  console.log(error);

});