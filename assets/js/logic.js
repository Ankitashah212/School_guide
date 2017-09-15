/*

ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A
data.gov authentication key

Query to select ethnicity for schools - i've kept year 2014, we can change year
https://api.data.gov/ed/collegescorecard/v1/schools?fields=school.name,id,2014.student.demographics.race_ethnicity.white,2014.student.demographics.race_ethnicity.black,2014.student.demographics.race_ethnicity.hispanic,2014.student.demographics.race_ethnicity.asian,2014.student.demographics.race_ethnicity.aian,2014.student.demographics.race_ethnicity.nhpi,2014.student.demographics.race_ethnicity.two_or_more,2014.student.demographics.race_ethnicity.non_resident_alien,2014.student.demographics.race_ethnicity.unknown,2014.student.demographics.race_ethnicity.white_non_hispanic,2014.student.demographics.race_ethnicity.black_non_hispanic,2014.student.demographics.race_ethnicity.asian_pacific_islander&sort=2014.completion.rate_suppressed.overall:desc&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A&school.name=new+york


//the whole school object --- lot of data
https://api.data.gov/ed/collegescorecard/v1/schools?id=164924&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A


// student financial data - not sure how I want to use it, at this point just ignore
https://api.data.gov/ed/collegescorecard/v1/schools?fields=school.name,id,2012.aid.median_debt.completers.overall,2012.repayment.1_yr_repayment.completers,2012.earnings.10_yrs_after_entry.working_not_enrolled.mean_earnings&page=100&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A

// my primary focus - gets overall sat score for school
https://api.data.gov/ed/collegescorecard/v1/schools.json?school.degrees_awarded.predominant=2,3&_fields=id,school.name,2013.student.size,
2013.admissions.sat_scores.average.overall
&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A&school.name=university+texas

The result fetches metadata and result array. Metadata says how many total results. by default  always page 0
you can add page count as part of query
*/

$(document).ready(function() {


    jQuery("form").submit(fetchData);

    function fetchData(event) {

        console.log("fetchData() Called")
        event.preventDefault();
        
        var schoolName = $("#school").val().trim();
        schoolName = schoolName.replace(' ', '+');
        
        console.log("schoolname", schoolName);

        // &_page=1 for page 1 and so forth by default page 0
        
        var query = "https://api.data.gov/ed/collegescorecard/v1/schools.json?"
            + "school.degrees_awarded.predominant=2,3&_fields=id,school.name,"
            + "2013.student.size,2013.admissions.sat_scores.average.overall"
            + "&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A&"
            + "school.name=" + schoolName;

        $.ajax({
            url: query,
            method: 'GET',
        //}).done(function (result) {
        }).success(function (result) {
            // console.log(query);
            console.log(result);
            console.log(result.results["0"]["school.name"]);
            displayData(result);
            //LARRYP: The code below should work, tried data: result, result.results, result.results[0] and each time it says "No Data" even though we have data
//            $('#clienti').bootstrapTable({
                // data: result.results[0]
                //data: result.results,
                //data: result,
                //rows: 1
//                load: result.results
//            });
         });// end of Ajax call
    } // end of function

    function displayData(result) {
        var mydata = [
            {"Nome":"",
                "Cognome":"",
                "DataN":"0000-00-00",
                "Provincia":"",
                "Comune":"",
                "CAP":"",
                "Indirizzo":"",
                "Fisso":"",
                "Mobile":"",
                "Note":""
            },
            {"Nome":"Federico",
                "Cognome":"Lupieri",
                "DataN":"2015-09-16",
                "Provincia":"",
                "Comune":"",
                "CAP":"34170",
                "Indirizzo":"Via Ascoli 1",
                "Fisso":"00112233445566",
                "Mobile":"00112233445566",
                "Note":"Vediamo se funziona questo"
            }
        ];
 
        console.log("Inside displayData()");
        /* result.results[0]["2013.admissions.sat_scores.average.overall"]  */
        console.log("result", result);
        var name =  result.results[0]["school.name"]
        var sat = result.results[0]["2013.admissions.sat_scores.average.overall"];
        var studentSize = result.results[0]["2013.student.size"]
        var id = result.results[0]["id"]
        console.log("name", name);
        console.log("id", id);
        console.log("studentSize", studentSize);
        console.log("sat", sat);
        var mydata2 = [
            {
                "school.name":name,
                "id":id,
                "2013.student.size":studentSize,
                "2013.admissions.sat_scores.average.overall":sat
            }
        ];
        $('#clienti').bootstrapTable({
            data: mydata2
        });
    
    }

}) //$(document).ready(function() {
