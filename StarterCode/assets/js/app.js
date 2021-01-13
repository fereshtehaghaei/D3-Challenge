//========================
//Browser Resize function 
//========================
function makeResponsive() {

  // If the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  var width = parseInt(d3.select("#scatter").style("width"))
  var height = (width - width /4)

    if (!svgArea.empty()) {
      svgArea.remove();
    }

    
  // svg params
  var svgHeight = height;
  var svgWidth = width;

  // Define the chart's margins as an object
  var chartMargin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
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
      d.healthcare  = +d.healthcare
      d.age = +d.age
      d.smokes = +d.smokes
      d.income = +d.income
      d.obesity = +d.obesity;
    });

    
    // Step 2: Create Scale functions
    // ============================== 
    // Ylinear-Scale for the vertical axis.
    var yLinearScale = d3.scaleLinear()
        .domain([
                d3.min(Data, d => d.healthcare)*.9,
                d3.max(Data, d => d.healthcare)*1.1
              ])
        .range([chartHeight, 0]);

    // Xlinear-Scale for the Horizontal axis.
    var xLinearScale = d3.scaleLinear()
        .domain([
                d3.min(Data, d => d.poverty)*.9,
                d3.max(Data, d => d.poverty)*1.1
              ])
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
          .classed("stateCircle", true);
          // .transition()
          // .duration(1500)
          // //.delay(1000)
          // .attr("r", 14);

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
        .attr("font-size", 11)
        .style("font-weight", "bold");
        // .transition()
        // .duration(1500)
        // //.delay(1000)
        // .attr("font-size", 12);


      // Step 7: Initialize tool-tip
      // ==============================
      var toolTip = d3.tip()
          .attr("class", "d3-tip")
          .offset([90, -40])
          .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Lacks Healthcare: ${d.healthcare}`);
          });


      // Step 8: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);

      // Step 9: Create Event Listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this)
        //.attr("mouseover", "green");
      })
      
        //==============?????????????????======
        // Event Listener for on-mouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data)
              d3.select(data, this)
                .attr("pointer-events", true) 
                .att("fill", "green");
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
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`)
        // .attr('x', chartWidth /2)
        // .attr('y', chartHeight +20)
        .attr("class", "axisText")
        .attr("dy", "1em")
        .text("In Poverty (%)");


      // Catching erros in console without having to catch at every line
      }).catch(function(error) {
      console.log(error);
      });

    }

    makeResponsive();
    
    // Event listener for window resize.
    // When the browser window is resized, makeResponsive() is called

    d3.select(window).on("resize", makeResponsive);


