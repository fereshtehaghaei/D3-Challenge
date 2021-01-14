//========================
//Browser Resize function 
//========================
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
  
    // Append Group Element & Set Margins - Shift (Translate) by Left and Top Margins Using Transform
    var chartGroup = svg
        .append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

    
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

      //==================================================================
      // Starting Bonus Section, setting up variables & Creating Functions
     //==================================================================
      
// ============================== 
// Step 1: Initial X & Y Axis
// ============================== 
var selectedXAxis = "poverty";
var selectedYAxis = "healthcare";


// ============================== 
// Step 2: Create Scale functions
//===============================

// Function To UPDATE the Xscale
function updateXScale(Data, selectedXAxis){
    // Creating Scale Function for Chart's selectedXAxis
    var xLinearScale = d3.scaleLinear()
        .domain([
                    d3.min(Data, d => d[selectedXAxis])*.9,
                    d3.max(Data, d => d[selectedXAxis])*1.1
                ])
        .range([0, chartWidth]);

    return xLinearScale;
        
     }

// Function To UPDATE the Yscale
function updateYScale(Data, selectedYAxis){
    // Creating Scale Function for Chart's selectedYAxis
    var yLinearScale = d3.scaleLinear()
            .domain([
                    d3.min(Data, d => d[selectedYAxis])*.9,
                    d3.max(Data, d => d[selectedYAxis])*1.1
                    ])
            .range([chartHeight, 0]);

    return yLinearScale;
     }
     
//=============================================
// Step 3: Create X & Y Axis updating function
// ============================================

// ???
// Updating xAxis Upon Click on Axis Label
function makeXaxis(newXScale,xAxis){
    var bottomAxis = d3.axisBottom(newXScale);
        //.call(bottomAxis);

    return bottomAxis;  
      }

      
// ???
// Updating yAxis Upon Click on Axis Label
function makeYaxis(newYScale,yAxis){
    var leftAxis = d3.axisLeft(newYScale); 
        //.call(leftAxis);

    return leftAxis;  
      }

// ===============================================
// Step 4: Function to Create/Update Circle Group
// ===============================================
function makeCircles(){
    //Append Axes (X & Y) to the chart
        chartGroup
            .append("g")
            .call(leftAxis);

        chartGroup
            .append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);

    var circlesGroup = chartGroup.append('g').selectAll("circle")
            .data(Data)
            .enter()
            .append("circle")
            .attr("cx", d => newXScale(d[selectedXAxis]))
            .attr("cy", d => newYScale(d[selectedYAxis]))
            .attr("r", 12)
            //.attr("fill", "red")
            .attr("opacity", .8)
            .classed("stateCircle", true);
            // .transition()
            // .duration(1500)
            // //.delay(1000)
            // .attr("r", 14);

    return circlesGroup;
       }
     

// ==================================================================
// Step 5: Function to Add/Update State Abbreviations Text to Circles
// ==================================================================
function makeText(){
    var textGroup = chartGroup.append("g").selectAll("text")
        .data(Data)
        .enter()
        .append("text")
        .attr("x", d => newXScale(d[selectedXAxis]))
        .attr("y", d => newYScale(d[selectedYAxis]))
        .classed("stateText", true)
        .text(d => d.abbr)
        .attr("font-size", 11)
        .style("font-weight", "bold");
        // .transition()
        // .duration(1500)
        // //.delay(1000)
        // .attr("font-size", 12);

    return textGroup;
        }

// ========================================
// Step 7: Function for updating tool-tip
// ========================================
function updateToolTip(){  
    // xLable Options
    if(selectedXAxis == "poverty") {
        var xLable = "Poverty (%)"
    }

    else if (selectedXAxis == "age"){
        var xLable = "Age (Median)"
    }

    else if (selectedXAxis == "income"){
        var xLable = "Household Income (Median)"
    }

    // yLable Options
    if(selectedXAxis == "healthcare") {
        var yLable = "Lacks Healthcare (%)"
    }

    else if (selectedXAxis == "smokes"){
        var yLable = "Smokes (%)"
    }

    else if (selectedXAxis == "obesity"){
        var yLable = "Obese (%)"
    }

    // Initialize ToolTip
    var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([90, -40])
            .html(function(d) {
              return (`<strong>${d.state}</strong>${d[selectedXAxis]}<br>${d[selectedYAxis]}`);
            });
        
    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create Event Listeners to display and hide the ToolTip
        // ==============================
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this)
         })

            // Event Listener for on-mouseout event
            .on("mouseout", function(data, index) {
              toolTip.hide(data, this)
            });

    return toolTip;       

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
  
  
        // Catching erros in console without having to catch at every line
        }).catch(function(error) {
        console.log(error);
        });
  
      }
  
      makeResponsive();
      
      // Event listener for window resize.
      // When the browser window is resized, makeResponsive() is called
  
      d3.select(window).on("resize", makeResponsive);
  
  
  