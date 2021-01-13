// Define SVG area dimensions
var svgWidth = 850;
var svgHeight = 550;

// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
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


    // Step 1: Parse Data/Cast as numbers
    // ===================================
    Data.forEach(function(d) {
      d.poverty = +d.poverty
      d.healthcare  = +d.healthcare;
    });


    // Step 2: Create Scale functions
    // ============================== 
    // Ylinear-Scale for the vertical axis.
    var yLinearScale = d3.scaleLinear()
        .domain([2, d3.max(Data, d => d.healthcare)])
        .range([chartHeight, 0]);

    // Xlinear-Scale for the Horizontal axis.
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(Data, d => d.poverty)])
        .range([0, chartWidth]);


    // Step 3: Create axis functions
    // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);


    // Step 4: Append Axes (X & Y) to the chart
    // ==============================
    chartGroup
      .append("g")
      .call(leftAxis);

    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

      // Step 5: Create Circles
      // ==============================
      var circlesGroup = chartGroup.append('g').selectAll("circle")
          .data(Data)
          .enter()
          .append("circle")
          .attr("cx", d => xLinearScale(d.poverty))
          .attr("cy", d => yLinearScale(d.healthcare))
          .attr("r", "12")
          //.attr("fill", "red")
          .attr("opacity", ".8")
          .classed("stateCircle", true)
          // .transition()
          // .duration(1500)
          // //.delay(1000)
          //.attr("r", 15);

      // Step 6: Add State Abbreviations Text to Circles
      // ==============================
      chartGroup.append("g").selectAll("text")
        .data(Data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .classed("stateText", true)
        .text(d => d.abbr)
        .attr("font-size", 10);


      // Step 7: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
          .attr("class", "d3-tip")
          .offset([80, -60])
          .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Lacks Healthcare: ${d.healthcare}`);
          });


      // Step 8: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);

      // Step 9: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this)
        //.attr("fill", "green");
      })

        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

      // Create Y-axes labels
      chartGroup
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -50)
          .attr("x", 0 - (chartHeight / 2))
          .attr("dy", "1em")
          //.attr("dx", "-13em")
          .attr("class", "axisText")
          .text("Lacks Healthcare (%)");

      chartGroup
        .append("text")
        .attr("x", chartWidth /2)
        //.attr("y",chartHeight +45)
        .attr("class", "axisText")
        .attr("dy", "32em")
        .text("In Poverty (%)");


      // Catching erros in console without having to catch at every line
      }).catch(function(error) {
      console.log(error);
      });
