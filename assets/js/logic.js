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

$(document).ready(function() {

    //*******************************************/
    //****************  EVENTS  *****************/
    //*******************************************/

    //Input Form Submit Button calls fetchData() Function
    jQuery("form").submit(fetchData);

    // Call fetchData() on enter click in Form input
    $("#school").one("keyup", function (e) {
        //If "enter" pressed, run fetchData()
        if (e.which == 13) {
            jQuery("form").submit(fetchData);            
        }
    })

    //Example Calling NamedFunction on Button Click:
    //$("#selector").on("click", namedFunction);

    //DrawChart Button calls displayPieChart() Function
    jQuery("#drawChart").on("click", displayPieChart);

    //******************************************/
    //**************  FUNCTIONS  ***************/
    //******************************************/

    function fetchData(event) {
        console.log("fetchData() Called")
        event.preventDefault();
        var schoolName = $("#school").val().trim();
        schoolName = schoolName.replace(' ', '+');
        console.log("schoolname", schoolName);
        // &_page=1 for page 1 and so forth by default page 0
        
        let query = "https://api.data.gov/ed/collegescorecard/v1/schools.json?" +
            "school.degrees_awarded.predominant=2,3&" +
            "_fields=id," +
            "school.name," +
            "2013.student.size," +
            "2013.admissions.sat_scores.average.overall&" +
            "api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A&"+
            "school.name=" + schoolName;
        $.ajax({
            url: query,
            method: 'GET',
        //}).done(function (result) {
        }).done(function (result) {
            // Append new row to table with data
            $("#table-body").append(
                '<tr>'
// L I N K   T O  R E S U L T S   P A G E
                + '<td><a class="results-link" href="#">' +result.results["0"]["school.name"] +'</a></td>'
                + '<td>' +result.results["0"].id + '</td>'
                + '<td>' +result.results["0"]["2013.student.size"] + '</td>'
                + '<td>' +result.results["0"]["2013.admissions.sat_scores.average.overall"] + '</td>'
                + '</tr>'
            )
        });// end of Ajax call
    }   

    function displayPieChart(event) {

        console.log("event", event);
        var schoolName = $("#school").val().trim();
        schoolName = schoolName.replace(' ', '+');
        if (schoolName == "") {
            alert("Please Enter a School Name.");
            return;
        }
        
        let query = "https://api.data.gov/ed/collegescorecard/v1/schools?fields=school.name," +
            "id," +
            "2014.student.demographics.race_ethnicity.white," +
            "2014.student.demographics.race_ethnicity.black," +
            "2014.student.demographics.race_ethnicity.hispanic," +
            "2014.student.demographics.race_ethnicity.asian," +
            "2014.student.demographics.race_ethnicity.non_resident_alien," +"&" +
            "sort=2014.completion.rate_suppressed.overall:desc&" +
            "api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A&" +
            //"school.name=university+texas+austin"
            "school.name=" + schoolName

        console.log("query", query);

        var asian, black, white, hispanic, nRAlien, others;
        
        $.ajax({
            url: query,
            method: 'GET',
        }).done(function (school) {
            // console.log(query);
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
                    'White',
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
    
        
        });// end of Ajax call
            
    }; //displayPieChart


    //******************************************/
    //**************  MAIN CODE  ***************/
    //******************************************/

    //No Main Code Yet!
  

}) ///$(document).ready(function() {
