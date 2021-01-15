//==============================================================
// <<<Function>>> Resizing Browser (Creating a Responsive page)
//==============================================================
function makeResponsive() {

    // If the SVG area isn't empty when the browser loads, remove & replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // Setup Chart Params
    var width = parseInt(d3.select("#scatter").style("width"))
    var height = (width - width /4)
  
      // Clear SVG if Not Empty
      if (!svgArea.empty()) {
        svgArea.remove();
      }
      
    // Setup Chart/SVG Params
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
  
  
    // Create an SVG Element/Wrapper- Select body, append SVG area & set the dimensions
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);
  
    // Append SVG Group Element & Set Margins - Shift (Translate) by Left and Top Margins Using Transform
    var chartGroup = svg
        .append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


// ============================== 
// Step 1: Initial X & Y Axis
// ============================== 
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


// ============================================= 
// Step 2: <<<Function>>> Create Scale functions
//==============================================

// Function To UPDATE the Xscale
function xScale(Data, chosenXAxis){
    // Creating Scale Function for Chart's selectedXAxis
    var xLinearScale = d3.scaleLinear()
        .domain([
                    d3.min(Data, d => d[chosenXAxis])*.9,
                    d3.max(Data, d => d[chosenXAxis])*1.1
                ])
        .range([0, chartWidth]);

    return xLinearScale;
     }

// Function To UPDATE the Yscale
function yScale(Data, chosenYAxis){
    // Creating Scale Function for Chart's selectedYAxis
    var yLinearScale = d3.scaleLinear()
            .domain([
                    d3.min(Data, d => d[chosenYAxis])*.9,
                    d3.max(Data, d => d[chosenYAxis])*1.1
                    ])
            .range([chartHeight, 0]);

    return yLinearScale;
     }
     
//================================================================================
// Step 3: <<<Function>>> Create X & Y Axis updating xAxis & yAxis var upon click
// ===============================================================================

// Updating xAxis Upon Click on Axis Label
function renderXAxes(newXScale,xAxis){
    var bottomAxis = d3.axisBottom(newXScale);
        
    xAxis.transition()
         .duration(1000)
         .call(bottomAxis);

    return xAxis; 
      }
      

// Updating yAxis Upon Click on Axis Label
function renderYAxes(newYScale,yAxis){
    var leftAxis = d3.axisLeft(newYScale); 
    
    yAxis.transition()
         .duration(1000)
         .call(leftAxis);

    return yAxis;  
      }

// ==================================================
// Step 4: <<<Function>>> Create/Update Circle Group
// ==================================================

// Updating and Transition to New Circles, Adjusting xScale & xAxil depending on data
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis){
    
    var circlesGroup = chartGroup.append('g').selectAll("circle")
            .data(Data)
            .enter()
            .append("circle")
            .attr("cx", d => newXScale(d[chosenXAxis]))
            .attr("cy", d => newYScale(d[chosenYAxis]))
            .attr("r", 12)
            .attr("opacity", .8)
            .classed("stateCircle", true)

        circlesGroup
            .transition()
            .duration(1000);

    return circlesGroup;
      }
     

// =========================================================================
// Step 5: <<<Function>>> to Add/Update State Abbreviations Text to Circles
// =========================================================================
function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis){
    var textGroup = chartGroup.append("g").selectAll("text")
        .data(Data)
        .enter()
        .append("text")
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]))
        .classed("stateText", true)
        .text(d => d.abbr)
        .attr("font-size", 11)
        .style("font-weight", "bold");

    return textGroup;
      }

// ================================================================
// Step 7: <<<Function>>> Updating Circles Group with New Tool-Tip
// ================================================================
function updateToolTip(){  

    var xLable;
    var yLable;

    // xLable Options
    if (chosenXAxis === "poverty") {
        xLable = "Poverty (%)"
    }

    else if (chosenXAxis === "age"){
            xLable = "Age (Median)"
    }

    else if (schosenXAxis === "income"){
            xLable = "Household Income (Median)"
    }

    // yLable Options
    if (chosenYAxis === "healthcare") {
        yLable = "Lacks Healthcare (%)"
    }

    else if (chosenYAxis === "smokes"){
             yLable = "Smokes (%)"
    }

    else if (chosenYAxis === "obesity"){
            yLable = "Obese (%)"
    }

    // Initialize ToolTip
    var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([90, -40])
            .html(function(d) {
              return (`<strong>${d.state}</strong>${d[chosenXAxis]}<br>${d[chosenYAxis]}`);
            });
        
    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create Event Listeners to display and hide the ToolTip
    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this)
    })

        // Event Listener for on-mouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data)
        });

    return circlesGroup;     
      }


        
  
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

    // ======================================
     // Import & Load data from data.csv File
    // =======================================
    d3.csv("assets/data/data.csv").then(function(Data) {

        // Parse Data/Cast as numbers
        Data.forEach(function(d) {
          d.poverty = +d.poverty
          d.healthcare  = +d.healthcare
          d.age = +d.age
          d.smokes = +d.smokes
          d.income = +d.income
          d.obesity = +d.obesity;
        });

  //Append Axes (X & Y) to the chart
  chartGroup
  .append("g")
  .call(leftAxis);

chartGroup
  .append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis);

  
        // Catching erros in console without having to catch at every line
        }).catch(function(error) {
        console.log(error);
        });

        
  
      }
  
      makeResponsive();
      
      // Event listener for window resize.
      // When the browser window is resized, makeResponsive() is called
  
      d3.select(window).on("resize", makeResponsive);
  
  
  