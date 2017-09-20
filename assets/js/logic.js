
//******************************************/
//**************  FUNCTIONS  ***************/
//******************************************/

//L O A D I N G   S C R E E N 
function hideLoader() {
    $('.results-loading').fadeOut();
    $('.results-content').css('visibility','visible').hide().fadeIn("slow");
    $('.map-card').css('visibility','visible').hide().fadeIn("slow");
}

function showLoader(){
    $('.results-loading').show();   
    $('.results-content').css('visibility','hidden');    
    $('.map-card').css('visibility','hidden');    
}

//W E L C O M E   D I V
function hideWelcome() {
    $('.welcome').hide();
}

function showWelcome() {
    $('.welcome').show();
}

function fetchData() {

    //Clear Table
    //$('#clienti').bootstrapTable('removeAll');
    showWelcome();
    showLoader();
    $(".main").show();
    $(".chart-body").css("display", "none");
    console.log("fetchData() Called")
    event.preventDefault();

    //getting value from index.html to filter results 
    var searchInput = $("#search-input").val().trim();
    var satScore = $("#sat").val().trim();
    var tuition = $("#tuition").val().trim();
    var degree = $("#degree").val().trim();
    var state = $("#state").val().trim();
    var flag = true;
    degree = degree.toLowerCase();

    if (degree == "blank") {
        degree = "";
    }
    if (state == "Blank") {
        state = "";
    }

    /*if (searchInput.length < 1 && satScore.length < 1 && tuition.length < 1 && degree.length < 1 && state.length <1) {
        console.log("no input data");
        flag = false;
    }
*/
    //replacing spaces with + to make it query ready
    searchInput = searchInput.replace(' ', '+');

    console.log("inputs :", searchInput, satScore, tuition, degree);

    //Query to fetch filtered data
    var query = "https://api.data.gov/ed/collegescorecard/v1/schools.json?" +
        "school.degrees_awarded.predominant=2,3&" +
        "_fields=id," +
        "school.name," +
        "2014.student.size," +
        "2014.admissions.sat_scores.average.overall&" +
        "api_key=ATN7AHDhDngU3Sb4EUtkVMaTkhUA1hr6dkDNro0A";

    // checking each filter's value to be not null before adding it to query filter for API
    if (searchInput.length > 1) {
        query = query + "&school.name=" + searchInput;
    }
    if (satScore.length > 1) {
        query = query + "&2014.admissions.sat_scores.average.overall__range=700.."
            + satScore;
    }
    if (tuition.length > 1) {
        query = query + "&2014.cost.avg_net_price.overall__range=2000.." + tuition;
    }
    if (degree.length > 1) {
        query = query + "&2014.academics.program.bachelors." + degree + "=1";
    }
    if (state.length > 1) {
        query = query + "&school.state=" + state;
    }

    console.log("Query " + query);
    $.ajax({
        url: query,
        method: 'GET',
    }).done(function (result) {
        displayData(result);
    });// end of Ajax call
} // fetchData()

function displayData(result) {

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
            // alert($el.id+"-"+$el.name+"-"+$el.type);
            // alert("Selected Row's ID: '" + $el.id + "'")

            $(".main").css("display", "none");
            hideWelcome();
            $(".chart-body").show();
            DisplayGraphs($el.id);
            setTimeout(hideLoader, 1000);
        }
    });
} //displayData()

function populateOptions() {
    // values for state drop down
    var stateOptions = ["Blank", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL",
        "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI",
        "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
        "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
        "WI", "WY"];
    var stateDropDown = $("#state");

    for (var i = 0; i < stateOptions.length; i++) {
        stateDropDown.append("<option>" + stateOptions[i] + "</option>");
    }

    var degreeOptions = [
        "Blank", "Agriculture", "Architecture", "Biological", "Business Marketing",
        "Communication", "Communications Technology", "Computer", "Construction", "Education",
        "Engineering", "Engineering Technology", "English", "Ethnic Cultural Gender",
        "Family Consumer Science", "Health", "History", "Humanities", "Language", "Legal",
        "Library", "Mathematics", "Mechanic Repair Technology", "Military", "Multidiscipline",
        "Parks Recreation Fitness", "Personal Culinary", "Philosophy Religious", "Physical Science",
        "Precision Production", "Psychology", "Public Administration Social Service", "Resources",
        "Science Technology", "Security Law Enforcement", "Social Science",
        "Theology Religious Vocation", "Transportation", "Visual Performing"];

    var degreeDropDown = $("#degree");

    for (var i = 0; i < degreeOptions.length; i++) {
        degreeDropDown.append("<option>" + degreeOptions[i] + "</option>");
    }
}

$(document).ready(function () {

    //populating dropdowns
    populateOptions();
    //*******************************************/
    //****************  EVENTS  *****************/
    //*******************************************/

    //Input Form Submit Button calls fetchData() Function
    jQuery("#form-button, #search-button").on("click", fetchData);

    //On keyup enter in search calls fetchData() Function
    $("#search-input").on("keyup", (e) => {
        //If "enter" pressed, call function
        if (e.which == 13) {
            fetchData();
        }
    })

    // On click of go-back-button returns to table div
    $("#go-back-button").on('click', () => {
        $(".chart-body").css("display", "none");
        $(".main").show();
        showLoader();
        showWelcome();
    })
}) ///$(document).ready(function() {
