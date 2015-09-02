var checked_eng_types = [];
var checked_courses = [];

rules = {
    "All": ["ENGR100", "ENGR101", "EMTH118", "EMTH119", "PHYS101"],
    "Software Engineering":  ["MATH120", "COSC121", "COSC122"],
    "Computer Engineering": ["EMTH171", "COSC121"],
    "Electrical and Electronic Engineering": ["EMTH171", "COSC121"],
    "Mechatronics Engineering": ["EMTH171", "COSC121", "ENGR102"],
    "Mechanical Engineering": ["EMTH171", "ENGR102"],
    "Civil Engineering": ["EMTH171", "CHEM111", "ENGR102"],
    "Natural Resources Engineering": ["EMTH171", "CHEM111", "ENGR102"],
    "Forest Engineering": ["EMTH171", "CHEM111", "ENGR102"],
    "Chemical and Process Engineering": ["EMTH171", "CHEM111"]
}

// ENGR100 hardcoded separately
semester_occurances = {
    "Semester 1": ["ENGR101", "EMTH118", "PHYS101", "COSC121", "CHEM111"],
    "Semester 2": ["ENG102", "EMTH119", "EMTH171", "COSC121", "CHEM111"],
    "Summer School": ["PHYS101", "COSC122"]  // check this
}


// on page load
$(document).ready(function() {

    var eng_types = Object.keys(rules); // get list of eng types from keys in dictionary
    // generate check box for each engineering type
    for (var i in eng_types) {
        generateEngCheckBoxes(eng_types[i], i);
    }

});


// create checkboxes for each eng type individually
function generateEngCheckBoxes(name, count) {

    // create the necessary elements
    var label = document.createElement("label");
    var description = document.createTextNode(name);
    var checkbox = document.createElement("input");

    checkbox.type = "checkbox";    // make the element a checkbox
    checkbox.name = 1;             // give it a name we can check in watchEngCB()
    checkbox.value = name;         // make its value
    checkbox.id = count;           // unique ID for each checkbox

    label.appendChild(checkbox);   // add the box to the element
    label.appendChild(description);// add the description to the element

    // add the label element to the div
    document.getElementById("eng_options").appendChild(label);

    // check if the button is clicked
    watchEngCB(); // TODO: does this need to be called for every button?

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
