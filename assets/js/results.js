var schoolID = "164924"
var queryURL = "https://api.data.gov/ed/collegescorecard/v1/schools?id=" + schoolID + "&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A"

// Variables for drawing data
var color = d3.scaleOrdinal(d3.schemeCategory20b);

var width = 500;
var height = 360;
var radius = Math.min(width, height) / 2;

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
                data.push(object[property].admissions.admission_rate.overall);
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

    // We make an empty svg to add our elements 
    var svg = d3.select('#bar-graph')
        .append('svg')
        .attr("width", width)
        .attr("height", height);

    var xScale = d3.scaleTime()
        .domain([new Date(1996, 0, 1), (new Date(2014, 0, 1))])
        .range([0, width]);   

    var yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    var xAxis = d3.axisBottom()
        .scale(xScale);
        
    var yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append('g')
        .classed('axis_x', true)
        .call(xAxis);
    
    svg.append('g')
        .classed('axis_y', true)
        .call(yAxis);

    // Make a bar for each element in the data array by using d3 
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
            .attr("fill", "#d1c9b8")
            .attr("width", 15)
            .attr("y", function (d) {
                return height - (d * 100);
            })
            .attr("height", function (d) {
                return d * 100;
            })
            .attr("x", function(d, i) {
                return i * 25;
    });


}

function DrawDemoGraph(data) {
    console.log("Data Set for Demo Graph", data);

    // Get basic svg 
    var svg = d3.select('#demo-graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

    .append('g')
    .attr('transform', 'translate(' + (width / 2) +
      ',' + (height / 2) + ')');

    // Add element to center the pie chart
    svg.append('g')
        .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

    // Add the arc using d3.arc()
    var arc = d3.arc()
        .innerRadius(0)
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
}

$(document).ready(function () {

    $.ajax({
        url: queryURL,
        method: 'GET',
    }).done(function (response) {
        console.log("Displaying Result");
        var dataObject = response.results["0"];
        console.log("Base School Object", dataObject);

        var admissionData = GetAdmissionData(dataObject);
        DrawBarGraph(admissionData);

        var demoData = GetDemoData(dataObject);
        DrawDemoGraph(demoData);
    });
})