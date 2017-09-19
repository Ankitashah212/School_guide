/*

ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A
data.gov authentication key

Query to select ethnicity for schools - i've kept year 2014, we can change year
https://api.data.gov/ed/collegescorecard/v1/schools?fields=
school.name,
id,
2014.student.demographics.race_ethnicity.white,
2014.student.demographics.race_ethnicity.black,
2014.student.demographics.race_ethnicity.hispanic,
2014.student.demographics.race_ethnicity.asian,
2014.student.demographics.race_ethnicity.aian,
2014.student.demographics.race_ethnicity.nhpi,
2014.student.demographics.race_ethnicity.two_or_more,
2014.student.demographics.race_ethnicity.non_resident_alien,
2014.student.demographics.race_ethnicity.unknown,
2014.student.demographics.race_ethnicity.white_non_hispanic,
2014.student.demographics.race_ethnicity.black_non_hispanic,
2014.student.demographics.race_ethnicity.asian_pacific_islander&
sort=2014.completion.rate_suppressed.overall:desc&
api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A&
school.name=new+york


//the whole school object --- lot of data
https://api.data.gov/ed/collegescorecard/v1/schools?id=164924&
api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A


// student financial data - not sure how I want to use it, at this point just ignore
https://api.data.gov/ed/collegescorecard/v1/schools?fields=school.name,id,2012.aid.median_debt.completers.overall,2012.repayment.1_yr_repayment.completers,2012.earnings.10_yrs_after_entry.working_not_enrolled.mean_earnings&
page=100&
api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A

// my primary focus - gets overall sat score for school
https://api.data.gov/ed/collegescorecard/v1/schools.json?school.degrees_awarded.predominant=2,3&
_fields=id,school.name,2013.student.size,
2013.admissions.sat_scores.average.overall
&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A&
school.name=university+texas

The result fetches metadata and result array. Metadata says how many total results. by default  always page 0
you can add page count as part of query
*/

$(document).ready(function () {

    //*******************************************/
    //****************  EVENTS  *****************/
    //*******************************************/

    //Input Form Submit Button calls fetchData() Function
    jQuery("form").submit(fetchData);

    //Example Calling NamedFunction on Button Click:
    //$("#selector").on("click", namedFunction);

    //DrawChart Button calls displayPieChart() Function
    jQuery("#drawChart").on("click", displayPieChart);

    //******************************************/
    //**************  FUNCTIONS  ***************/
    //******************************************/

    function fetchData(event) {

        //Clear Table
        //$('#clienti').bootstrapTable('removeAll');

        console.log("fetchData() Called")
        event.preventDefault();

        //getting value from index.html to filter results 
        var schoolName = $("#school").val().trim();
        var satScore = $("#sat").val().trim();
        var tuition = $("#tuition").val().trim();
        var degree = $("#degree").val().trim();
        var flag = true;
        degree = degree.toLowerCase();

        if (degree == "select degree") {
            degree = "";
        }
        if (schoolName.length < 1 && satScore.length < 1 && tuition.length < 1 && degree.length < 1) {
            console.log("no input data");
            flag = false;
        }

        //replacing spaces with + to make it query ready
        schoolName = schoolName.replace(' ', '+');

        console.log("inputs :", schoolName, satScore, tuition, degree);

        //Clear Field
        $('#school').val('');

        //Query to fetch filtered data
        var query = "https://api.data.gov/ed/collegescorecard/v1/schools.json?" +
            "school.degrees_awarded.predominant=2,3&" +
            "_fields=id," +
            "school.name," +
            "2014.student.size," +
            "2014.admissions.sat_scores.average.overall&" +
            "api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A";

        // checking each filter's value to be not null before adding it to query filter for API
        if (schoolName.length > 1) {
            query = query + "&school.name=" + schoolName;
        }
        if (satScore.length > 2) {
            query = query + "&2014.admissions.sat_scores.average.overall__range=700.."
                + satScore;
        }
        if (tuition.length > 1) {
            query = query + "&2014.cost.avg_net_price.overall__range=2000.." + tuition;
        }
        if (degree.length > 1) {
            query = query + "&2014.academics.program.bachelors."
                + degree + "=1";
        }

        //   console.log("Query " + query);
        $.ajax({
            url: query,
            method: 'GET',
        }).done(function (result) {
            displayData(result);
        });// end of Ajax call
    } // fetchData()

    function displayData(result) {

        /* result.results[0]["2013.admissions.sat_scores.average.overall"]  */
        console.log("result.results.length", result.results.length);

        //Clearing Table
        $('#clienti').bootstrapTable('removeAll');

        var mydata2 = [];
        for (i = 0; i < result.results.length; i++) {
            var name = result.results[i]["school.name"]
            var sat = result.results[i]["2014.admissions.sat_scores.average.overall"];
            var studentSize = result.results[i]["2014.student.size"]
            var id = result.results[i]["id"]
            var tmp = [
                {
                    "school.name": "" + name,
                    "id": "" + id,
                    "2014.student.size": "" + studentSize,
                    "2014.admissions.sat_scores.average.overall": "" + sat
                }
            ];
            mydata2.push.apply(mydata2, tmp);
        }
        console.log("mydata2", mydata2);

        $('#clienti').bootstrapTable({
            data: mydata2
        });

        //Refresh Data by Appending it
        $('#clienti').bootstrapTable('append', mydata2);

        //Add Row Click Event to Table
        $('#clienti').on('click-cell.bs.table', function (field, value, row, $el) {
            if (value != "type") {
                //alert($el.id+"-"+$el.name+"-"+$el.type);
                // alert("Selected Row's ID: '" + $el.id + "'")

                $(".main").css("display", "none");
                $(".chart-body").show();
                makeGraphsForSchoolID($el.id);
            }
        });

    } //displayData()

    function displayPieChart(event) {

        var schoolName = $("#school").val().trim();
        schoolName = schoolName.replace(' ', '+');
        if (schoolName == "") {
            alert("Please Enter a School Name.");
            return;
        }

        var query = "https://api.data.gov/ed/collegescorecard/v1/schools?fields=school.name," +
            "id," +
            "2014.student.demographics.race_ethnicity.white," +
            "2014.student.demographics.race_ethnicity.black," +
            "2014.student.demographics.race_ethnicity.hispanic," +
            "2014.student.demographics.race_ethnicity.asian," +
            "2014.student.demographics.race_ethnicity.aian," +
            "2014.student.demographics.race_ethnicity.nhpi," +
            "2014.student.demographics.race_ethnicity.two_or_more," +
            "2014.student.demographics.race_ethnicity.non_resident_alien," +
            "2014.student.demographics.race_ethnicity.unknown," +
            "2014.student.demographics.race_ethnicity.white_non_hispanic," +
            "2014.student.demographics.race_ethnicity.black_non_hispanic," +
            "2014.student.demographics.race_ethnicity.asian_pacific_islander&" +
            "sort=2014.completion.rate_suppressed.overall:desc&" +
            "api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A&" +
            //"school.name=university+texas+austin"
            "school.name=" + schoolName

        var asian, black, white, hispanic, nRAlien, others;

        $.ajax({
            url: query,
            method: 'GET',
        }).done(function (school) {
            console.log(school);
            white = school.results["0"]["2014.student.demographics.race_ethnicity.white"];
            nRAlien = (school.results["0"]["2014.student.demographics.race_ethnicity.non_resident_alien"]);
            hispanic = (school.results["0"]["2014.student.demographics.race_ethnicity.hispanic"]);
            black = (school.results["0"]["2014.student.demographics.race_ethnicity.black"]);
            asian = (school.results["0"]["2014.student.demographics.race_ethnicity.asian"]);
            others = 1 - (white + black + hispanic + asian + nRAlien);
            console.log(white, nRAlien, hispanic, black, asian, others);
            var ctx = document.getElementById("pieChart");
            console.log("white, nRAlien, hispanic, black, asian, others");

            console.log(white, nRAlien, hispanic, black, asian, others);

            //data fot pie chart
            data = {
                datasets: [{
                    backgroundColor: [
                        //set colors for chart
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    //data for pie
                    data: [white, black, asian, hispanic, nRAlien, others]
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    'Whilte',
                    'Black',
                    'Asian',
                    'Hispanic',
                    'Non Resident Alien',
                    'Others'
                ]
            }; //data

            new Chart(ctx, {
                data: data,
                type: 'pie',
            });

            // bar part, i'll let the team decide on which one to use
            // Bar chart
            /*
                var cht = document.getElementById("barChart");
                //data fot bar chart
                data = {
                    datasets: [{
                        backgroundColor: [
                            //set colors for chart
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        //data for bar
                        data: [0.5, 0.6, 0.2, 0.1, 1.1, 0.8]
                    }],
    
                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: [
                        'Whilte',
                        'Black',
                        'Asian',
                        'pacific',
                        'native American',
                        'others'
                    ]
                };
                new Chart(ctx, {
                    data: data,
                    type: 'bar',
                });
                
            */
        });// end of Ajax call

    }; //displayPieChart


    //******************************************/
    //**************  MAIN CODE  ***************/
    //******************************************/

    //No Main Code Yet!


}) ///$(document).ready(function() {

//--------------------------------------------------------------------------

// new chart stuff

//---------------------------------------------------------------------------



// Variables for drawing data
var color = d3.scaleOrdinal(d3.schemeCategory20b);

var width = 360;
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
            if (typeof object[property].admissions !== "undefined")
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
            property == "white") {
            var tempObject = { label: property, count: object[2014].student.demographics.race_ethnicity[property] };
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

    // var xAxis = d3.svg.axis()
    //     .scale(x)
    //     .orient("bottom");

    // var yAxis = d3.svg.axis()
    //     .scale(y)
    //     .orient("left");

    // svg.append('g')
    //     .attr('class', 'axis_x')
    //     .call(xAxis);

    // svg.append('g')
    //     .attr('class', 'axis_y')
    //     .call(yAxis);

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
        .attr("x", function (d, i) {
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
        .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    // Add the arc using d3.arc()
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Define the slices
    var pie = d3.pie()
        .value(function (d) { return d.count; })
        .sort(null);

    // Draw the lines using path by passing our earlier variables
    var path = svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d, i) {
            return color(d.data.label)
        });
}


function makeGraphsForSchoolID(schoolID) {
    
    var queryURL = "https://api.data.gov/ed/collegescorecard/v1/schools?id=" + schoolID + "&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A"

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
    }); // end of ajax call
}

