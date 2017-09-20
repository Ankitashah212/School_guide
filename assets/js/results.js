// Variables for drawing data
var color = d3.scaleOrdinal(d3.schemeCategory20b);

var fullWidth = 600;
var fullHeight = 360;
var margin = {
    top: 15,
    right: 150,
    left: 50,
    bottom: 50
  };

var width = fullWidth - margin.left - margin.right;
var height = fullHeight - margin.top - margin.bottom;
var radius = Math.min(width, height) / 2;
var donutWidth = 75;
var legendRectSize = 18;
var legendSpacing = 4;

function GetAdmissionData(object) {
    // Check the object passed
    console.log(object);

    // Turn the object into a workable data array
    // Start with a blank data array
    var data = [];

    // For each property (for our objects it should be each year), 
    for (var property in object) {
        // if that property(year) exists
        if (object.hasOwnProperty(property)) {
            // And the subproperty is defined
            if(typeof object[property].admissions !== "undefined")
                // Pass that data to our empty array
                if(object[property].admissions.sat_scores.average.overall != null)
                    data.push(object[property].admissions.sat_scores.average.overall);
        }
    }

    return data;
}

function GetDemoData(object) {
    var data = [];
    // For each property (for our objects it corresponse to different ethnicities), 
    for (var property in object[2014].student.demographics.race_ethnicity) {
        // console.log("Property", property)
        // if that property(ethnicity) exists && and it's one of the types we are lookign for
        if (property == "aian" || 
            property == "asian" || 
            property == "black" || 
            property == "hispanic" || 
            property == "non_resident_alien" || 
            property == "two_or_more" ||
            property == "white")
        {
            var tempObject = {label: property, count: object[2014].student.demographics.race_ethnicity[property]};
            data.push(tempObject);
        }
    }
    return data;
}

function DrawBarGraph(data) {
    console.log("Data Set for Addmissions Graph", data);
    // We make an empty svg to add our elements 
    $("#bar-graph").empty();
    var svg = d3.select('#bar-graph')
        .append('svg')
        .attr("width", fullWidth)
        .attr("height", fullHeight)
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var xScale = d3.scaleTime()
        .domain([new Date(2014 - data.length+1, 0, 1), (new Date(2014, 0, 1))])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, 2400])
        .range([height, 0]);

    var xAxis = d3.axisBottom(xScale)
        .ticks(data.length - 1)
        .tickSize(5);
        
    var yAxis = d3.axisLeft()
        .scale(yScale);

    var barWidth = width / (data.length-1);

    svg.append('g')
        .attr("transform", "translate(0,"+ (height) +")")
        .classed('axis_x', true)
        .call(xAxis);
    
    svg.append('g')
        // .attr("transform", function(d) { return "translate(" + barWidth + ",0)"; })
        .classed('axis_y', true)
        .call(yAxis);

        
        
    // Make a bar for each element in the data array by using d3 
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
            .attr("fill", "#d1c9b8")
            .attr("width", barWidth /2)
            .attr("y", function (d) {
                return yScale(d);
            })
            .attr("height", function (d) {
                return height - yScale(d);
            })
            .attr("x", function(d, i) {
                return i * barWidth;
    });

}

function DrawDemoGraph(data) {
    console.log("Data Set for Demo Graph", data);

    // Get basic svg 
    $("#demo-graph").empty();
    var svg = d3.select('#demo-graph')
    .append('svg')
    .attr('width', fullWidth)
    .attr('height', fullHeight)

    .append('g')
        .attr('transform', 'translate(' + (fullWidth / 2) +
        ',' + (fullHeight / 2) + ')');

    // Add element to center the pie chart
    svg.append('g')
        .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

    // Add the arc using d3.arc()
    var arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);

    // Define the slices
    var pie = d3.pie()
        .value(function(d) {return d.count; })
        .sort(null);

    // Draw the lines using path by passing our earlier variables
    var path = svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i){
                return color (d.data.label)
            });
    
    var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
        .classed('legend', true)
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = width / 2;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
    });
    
    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);
    
    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function(d) { return d; });
  
}

function DisplayGraphs(id) {

    var schoolID = id;
    var queryURL = "https://api.data.gov/ed/collegescorecard/v1/schools?id=" + schoolID + "&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A"
    
    $.ajax({
        url: queryURL,
        method: 'GET',
    }).done(function (response) {
        console.log("Displaying Result");
        var dataObject = response.results["0"];
        console.log("Base School Object", dataObject);
        //Display school name
        let name = dataObject.school.name;
        $('#school-name').html(name);

        console.log("lat and long");
        console.log(dataObject.location.lat);
        console.log(dataObject.location.lon);
        var admissionData = GetAdmissionData(dataObject);
        DrawBarGraph(admissionData);

        var demoData = GetDemoData(dataObject);
        DrawDemoGraph(demoData);
    });
}

$(document).ready(function() {
    DisplayGraphs(164924);    
})
