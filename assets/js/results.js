var schoolID = "164924"
var queryURL = "https://api.data.gov/ed/collegescorecard/v1/schools?id=" + schoolID + "&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A"

function GetAdmmisionData(object) {
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
            property == "two_or_more") 
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
        .attr("width", 500)
        .attr("height", 200);

    // Make a bar for each element in the data array by using d3 
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
            .attr("fill", "#d1c9b8")
            .attr("width", 15)
            .attr("y", function (d) {
                return 200 - (d * 100);
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
}

$(document).ready(function () {

    $.ajax({
        url: queryURL,
        method: 'GET',
    }).done(function (response) {
        console.log("Displaying Result");
        var dataObject = response.results["0"];
        console.log("Base School Object", dataObject);

        // var admissionData = GetAdmmisionData(dataObject);
        // DrawBarGraph(admissionData);

        var demoData = GetDemoData(dataObject);
        DrawDemoGraph(demoData);
    });
})