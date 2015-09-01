var eng_types = [];
var courses = [];
var checked_eng_types = [];
var checked_courses = [];

// import rules from csv file on first load
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "rules3.csv",
        dataType: "text",
        success: function(data) {
            processData(data);
        }
    });
});



// put csv dat into lists - eng options and course options
function processData(csv_text) {

    var csv_rows = csv_text.split(/\r\n|\n/);
    for (var i=0; i<csv_rows.length; i++) {
        var data = csv_rows[i].split(',');

        if (i == 3) {
            for (var j in data) {
                if (j > 2){
                    eng_types.push(data[j])
                }
            }
        } else if (i > 3){
            courses.push(data);
        }
    }

    for (var i in eng_types) {
        generateCheckBoxes(null, eng_types[i], "eng_options", i);
    }


    for (var i in courses) {
        if (courses[i][0] == "Semester 1") { // i+1 to give different ID's than eng_option checkboxes
           generateCheckBoxes("Semester 1", courses[i][1], "semester_one", parseInt(i)+9);
        } else if (courses[i][0] == "Semester 2") {
            generateCheckBoxes("Semester 2", courses[i][1], "semester_two", parseInt(i)+9);
        } else {
            generateCheckBoxes("Summer", courses[i][1], "summer", parseInt(i)+9);
        }
    }

    countCoursesPerSemester();

}


// create checkboxes for each option individually
function generateCheckBoxes(semester, name, div_tag, count) {

    // create the necessary elements
    var label = document.createElement("label");
    var description = document.createTextNode(name);
    var checkbox = document.createElement("input");

    checkbox.type = "checkbox";    // make the element a checkbox
    checkbox.name = 1;      // give it a name we can check on the server side
    checkbox.value = name;         // make its value
    checkbox.id = count;    // unique ID for each checkbox

    label.appendChild(checkbox);   // add the box to the element
    label.appendChild(description);// add the description to the element

    // add the label element to the div
    document.getElementById(div_tag).appendChild(label);

    if (div_tag == "eng_options") {
        watchEngCB();
    } else { //check the required courses
        if (courses[count-9][3] == "All") {
        checkbox.checked = true;
        checked_courses.push([semester, name, checkbox.id]);
        }
    }

    console.log(checkbox);

}


// watch the engineering checkboxes for change
function watchEngCB() {
    $("[name=1]").change(function() {
        var index = checked_eng_types.indexOf(this.value);
        if(this.checked) {
            if (index == -1) {
                checked_eng_types.push(this.value);
                addMoreCourses(this.id);
            }
        } else {
            if (index > -1) {
                checked_eng_types.splice(index, 1);
                changeHighlightedCourses(this);
            }
        }
    });

}


// check new courses when new eng option selected
function addMoreCourses(cbID) {

    for (var i in courses) {
        console.log(courses[i][parseInt(cbID)+3])
        if (courses[i][parseInt(cbID)+3] == "Req" ){
            document.getElementById(parseInt(i)+9).checked = true;
            checked_courses.push([courses[i][0], courses[i][1], parseInt(i)+9]);
        }
        if (courses[i][parseInt(cbID)+3] == "Rec" ){
            document.getElementById(parseInt(i)+9).checked = true;
            checked_courses.push([courses[i][0], courses[i][1], parseInt(i)+9]);
        }
    }

    countCoursesPerSemester();

}


// uncheck courses when eng option unselected
function changeHighlightedCourses(cbID) {

    var index;
    for (var i in courses) {
        for (var j in checked_courses) {
            if (checked_courses[j][1] == courses[i][1]) {
                index = j
            }
        }
        if (courses[i][parseInt(cbID.id)+3] == "Req") {
            checked_courses.splice(index, 1);
        }
        if (courses[i][parseInt(cbID.id)+3] == "Rec") {
            checked_courses.splice(index, 1);
        }
    }

    var current_checkbox;
    var found;
    for (var box = 9; box < 26; box++) {
        current_checkbox = document.getElementById(box);
        found = false;
        for (var i in checked_courses) {
            if (checked_courses[i][1] == current_checkbox.value) {
                found = true;
            }
        }

        if (found == false) {
            current_checkbox.checked = false;
        }

        countCoursesPerSemester();
    }

}


function countCoursesPerSemester() {

    var unique_checked_courses = [];

    var semester_one_count = 0;
    var semester_two_count = 0;
    var summer_count = 0;


    for (var j in checked_courses) {
        var found = false;
        if (unique_checked_courses.length > 0){
            for (var i in unique_checked_courses){
                if (checked_courses[j][1] == unique_checked_courses[i][1]) {
                    found = true;
                }
            }
            if (found == false) {
                unique_checked_courses.push(checked_courses[j])
            }
        } else {
            unique_checked_courses.push(checked_courses[j])
        }
    }

    for (var i in unique_checked_courses) {
        if (unique_checked_courses[i][0] == "Semester 1") {
            semester_one_count += 1;
        } else if (unique_checked_courses[i][0] == "Semester 2") {
            semester_two_count += 1;
        } else {
            summer_count += 1;
        }
    }

    displayCourseCount(semester_one_count, semester_two_count, summer_count);

}


function displayCourseCount(semester_one_count, semester_two_count, summer_count) {

    document.getElementById('semester_one_total').innerHTML = "Courses: " + semester_one_count;
    document.getElementById('semester_two_total').innerHTML = "Courses: " + semester_two_count;
    document.getElementById('summer_total').innerHTML = "Courses: " + summer_count;

    if (semester_one_count > 5) {
        document.getElementById('semester_one_total').style.color = 'red';
    } else {
        document.getElementById('semester_one_total').style.color = 'black';
    }

    if (semester_two_count > 4) {
        document.getElementById('semester_two_total').style.color = 'red';
    } else {
        document.getElementById('semester_two_total').style.color = 'black';
    }

}

