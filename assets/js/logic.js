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

    $(document).on("click", "#formSubmit", fetchData);



    function fetchData() {

        var schoolName = $("#school").val();
        schoolName = schoolName.replace(' ', '+');


        // &_page=1 for page 1 and so forth by default page 0
        
        var query = "https://api.data.gov/ed/collegescorecard/v1/schools.json?"
            + "school.degrees_awarded.predominant=2,3&_fields=id,school.name,"
            + "2013.student.size,2013.admissions.sat_scores.average.overall"
            + "&api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A&"
            + "school.name=" + schoolName;

        console.log(schoolName);


        $.ajax({
            url: query,
            method: 'GET',
        }).done(function (result) {
            // console.log(query);
            console.log(result);
            console.log(result.results["0"]["school.name"]);

        });// end of Ajax call
    } // end of function

