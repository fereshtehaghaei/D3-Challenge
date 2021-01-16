//==============================================================
// <<<Function>>> Resizing Browser (Creating a Responsive page)
//==============================================================
function makeResponsive() {

    // If the SVG area isn't empty when the browser loads, remove & replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // Setup Chart Params
    var width = parseInt(d3.select("#scatter").style("width"));
    var height = (width - width /4);
  
      // Clear SVG if Not Empty
      if (!svgArea.empty()) {
        svgArea.remove();
      }
      
    // Setup Chart/SVG Params
    var svgHeight = height;
    var svgWidth = width;
  
    // Define the chart's margins as an object
    var chartMargin = {
        top: 40,
        right: 40,
        bottom: 120,
        left: 100
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
    var chartGroup = svg.append("g")
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
function xScale(Data, chosenXAxis) {
    // Creating Scale Function for Chart's selectedXAxis
    var xLinearScale = d3.scaleLinear()
        .domain([
                    d3.min(Data, d => d[chosenXAxis])*.9,
                    d3.max(Data, d => d[chosenXAxis])*1.2
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
                    d3.max(Data, d => d[chosenYAxis])*1.2
                    ])
            .range([chartHeight, 0]);

    return yLinearScale;
     }
     
//================================================================================
// Step 3: <<<Function>>> Create X & Y Axis updating xAxis & yAxis var upon click
// ===============================================================================

// Updating xAxis Upon Click on Axis Label
function renderXAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);
        
    xAxis.transition()
         .duration(1000)
         .call(bottomAxis);

    return xAxis; 
      }
      

// Updating yAxis Upon Click on Axis Label
function renderYAxes(newYScale, yAxis){
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
    
    // var circlesGroup = chartGroup.append('g').selectAll("circle")
    //         .data(Data)
    //         .enter()
    //         .append("circle")
    //         .attr("cx", d => newXScale(d[chosenXAxis]))
    //         .attr("cy", d => newYScale(d[chosenYAxis]))
    //         .attr("r", 12)
    //         .attr("opacity", .8)
    //         .classed("stateCircle", true)

        circlesGroup
            .transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]))
            .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
      }
     

// =========================================================================
// Step 5: <<<Function>>> to Add/Update State Abbreviations Text to Circles
// =========================================================================
function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis){
    // var textGroup = chartGroup.append("g").selectAll("text")
    //     .data(Data)
    //     .enter()
    //     .append("text")
    //     .attr("x", d => newXScale(d[chosenXAxis]))
    //     .attr("y", d => newYScale(d[chosenYAxis]))
    //     .classed("stateText", true)
    //     .text(d => d.abbr)
    //     .attr("font-size", 11)
    //     .style("font-weight", "bold");

        textGroup
            .transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]))
            .classed(".aText", true);

    return textGroup;
      }

// ================================================================
// Step 7: <<<Function>>> Updating Circles Group with New Tool-Tip
// ================================================================
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup){  

    var xLable;
    var yLable;

    // xLable Options
    if (chosenXAxis === "poverty") {
        xLable = "Poverty (%)";
    }

    else if (chosenXAxis === "age"){
            xLable = "Age (Median)";
    }

    else //if (chosenXAxis === "income")
    {
            xLable = "Household Income (Median)";
    }

    // yLable Options
    if (chosenYAxis === "healthcare") {
        yLable = "Lacks Healthcare (%)";
    }

    else if (chosenYAxis === "smokes"){
             yLable = "Smokes (%)";
    }

    else //if (chosenYAxis === "obesity")
    {
            yLable = "Obese (%)";
    }
 
    // Initialize ===ToolTip===
    var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([90, -40])
            .html(function(d) {
                return (`${d.state} <br> ${xLable} ${d[chosenXAxis]} <br> ${yLable} ${d[chosenYAxis]}`);
            });
        
        // Create CRICLES Tooltip in the chart
        circlesGroup.call(toolTip);

        // Create Event Listeners to display and hide the ToolTip
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this)
            d3.select(this).style("fill", "blue").transition().duration(0);
        })

            // Event Listener for on-mouseout event
            .on("mouseout", function(data, index) {
                toolTip.hide(data)
                d3.select(this).style("fill", "green").transition().duration(0);
            });


        // Create TEXT Tooltip in the chart for (inside Circles)
        textGroup.call(toolTip);

        // Create Event Listeners to display and hide the ToolTip
        textGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
            // Event Listener for on-mouseout event
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });

    return circlesGroup;

}

// ==================================================================  
// ******************************************************************
// Step 8: Retrieve Data from CSV File and Execute Everything Below
// ******************************************************************     
// ==================================================================  

    // Import Data
    d3.csv("assets/data/data.csv").then(function(Data) {

        // Parse Data/Cast as numbers
        Data.forEach(function(d) {
          d.poverty = +d.poverty;
          d.healthcare  = +d.healthcare;
          d.age = +d.age;
          d.smokes = +d.smokes;
          d.income = +d.income;
          d.obesity = +d.obesity;
        });

    // Calling the xScale we created
    var xLinearScale = xScale(Data, chosenXAxis);  
    
    // Create y scale function
    var yLinearScale = yScale(Data, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append XAxis to the chart
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`) //pushing axis down
        //.classed("active", true)
        .call(bottomAxis);
  
    // Append YAxis to the chart
    var yAxis = chartGroup.append("g")
        .call(leftAxis);
    
    // Append initial circles
    var circlesGroup = chartGroup.append("g").selectAll("circle")
        .data(Data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .classed("stateCircle", true)
        .attr("r", 12)
        .attr("opacity", ".5");

    // Append Text to Cirle
    var textGroup = chartGroup.append("g").selectAll("text")
        .data(Data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .classed("stateText", true)
        .text(d => d.abbr)
        .attr("font-size", 11)
        .style("font-weight", "bold");

    // Create Lable Group for x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
    
    var povertyLabel = xlabelsGroup.append("text") 
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .attr("dy", "1em")
        //.classed("axisText", true)
        .classed("active", true)
        .text("In Poverty (%)");
    
   
    var ageLabel = xlabelsGroup.append("text") 
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .attr("dy", "1em")
        //.classed("axisText", true)
        .classed("inactive", true)
        .text("Age (Median)");
    
    
    var incomeLabel = xlabelsGroup.append("text") 
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .attr("dy", "1em")
        //.classed("axisText", true)
        .classed("inactive", true)
        .text("Household Income (Median)");


    // Create Lable Group for y-axis labels
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")

    
    var healthcareLabel = ylabelsGroup.append("text")
        .attr("y", -50)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "healthcare")
        .attr("dy", "1em")
        //.classed("axisText", true)
        .classed("active", true)
        .text("Lacks Healthcare (%)");


    var smokesLabel = ylabelsGroup.append("text")
        .attr("y", -70)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "smokes")
        .attr("dy", "1em")
        //.classed("axisText", true)
        .classed("inactive", true)
        .text("Smokes (%)");


    var obeseLabel = ylabelsGroup.append("text")
        .attr("y", -90)
        .attr("x", 0 - (chartHeight / 2))
        .attr("value", "obesity")
        .attr("dy", "1em")
        //.classed("axisText", true)
        .classed("inactive", true)
        .text("Obese (%)");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);



  // =========== X Axis ===========

 // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
        
    var value = d3.select(this).attr("value"); // get value of selection

        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // console.log(chosenXAxis)

            // updates x scale for new data
            xLinearScale = xScale(Data, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates text with new values
            textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(circlesGroup, textGroup,chosenXAxis, chosenYAxis);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {

            povertyLabel
                .classed("active", true)      // adding active class
                .classed("inactive", false); // removing inactive class
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
        }

        else if  (chosenXAxis === "age") {
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", true)
                .classed("inactive", false);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
        }

        else {
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
        }
    }
  });


  // =========== Y Axis ===========

  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {

    var value = d3.select(this).attr("value");   // get value of selection
        
        if (value !== chosenYAxis) {

            // replaces chosenYAxis with value
            chosenYAxis = value;

            // console.log(chosenYAxis)

            // updates y scale for new data
            yLinearScale = yScale(Data, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new y values
            circlesGroup = renderCircles(circlesGroup,  xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates circles with new y values
            textGroup = renderText(textGroup,  xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates tooltips with new Y value
            circlesGroup = updateToolTip(circlesGroup, textGroup, chosenYAxis, chosenXAxis, xLinearScale, ylinearScale);

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {

            healthcareLabel
                .classed("active", true)      // adding active class
                .classed("inactive", false); // removing inactive class
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obeseLabel
                .classed("active", false)
                .classed("inactive", true);
        }

        else if  (chosenYAxis === "smokes") {
            heathcareLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", true)
                .classed("inactive", false);
            obeseLabel
                .classed("active", false)
                .classed("inactive", true);
        }

        else {
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obeseLabel
                .classed("active", true)
                .classed("inactive", false);
        }
    }

  });
  
// Catching erros in console without having to catch at every line
})
.catch(function(error) {
    console.log(error);
});
  
}
  
makeResponsive();
      
// Event listener to resizeing the chart when window is resized
d3.select(window).on("resize", makeResponsive);
  
  
  