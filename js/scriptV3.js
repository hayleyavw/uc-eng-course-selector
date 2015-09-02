/*
 * Author: Hayley van Waas, University of Canterbury
 * Date: September 2015
 *
 * This is an interactive designed to help students select which subjects to take in their first year of engineering at the University of Canterbury
 */


// TODO: remove global variables

var checked_eng_types = [];
var checked_courses = [];

// Engineering type: required subjects
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
// Semester: available subjects
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

    buildDefaultTable();

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


function buildDefaultTable() {
    var subject_table = document.getElementById("subject-table");

    var tableBody = document.createElement("tbody");

    //var tr = document.createElement('tr');
    //var td = document.createElement('td');
    //td.appendChild(document.createTextNode("hi"));
    //tr.appendChild(td);
    //tableBody.appendChild(tr);

    subject_table.appendChild(tableBody);

    // hard coded ENGR100
    var new_row = subject_table.insertRow(1);
    var new_cell = new_row.insertCell(0);
    var new_text = document.createTextNode("ENGR100");
    new_cell.appendChild(new_text);
    // adjust column span
    document.getElementById("subject-table").rows[1].cells[0].colSpan = 2;

    // add all compulsory courses to table
    compulsory_courses = rules["All"];
    for (var i = 2; i < compulsory_courses.length+1; i++) {
        var new_row = subject_table.insertRow(i);
        var new_cell = new_row.insertCell(0);
        var new_text = document.createTextNode(compulsory_courses[i-1]);
        new_cell.appendChild(new_text);
    }

}


// check new courses when new eng option selected
function addMoreCourses(cbID) {

}


// uncheck courses when eng option unselected
function changeHighlightedCourses(cbID) {

}



function countCoursesPerSemester() {


}


function displayCourseCount(semester_one_count, semester_two_count, summer_count) {


}
