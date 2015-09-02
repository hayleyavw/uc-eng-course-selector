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
    // create table body, and append to subject table
    var tableBody = document.createElement("tbody");
    subject_table.appendChild(tableBody);

    // hard coded ENGR100 row
    var new_row = subject_table.insertRow(1);
    var new_cell = new_row.insertCell(0);
    new_cell.className = "required";
    var new_text = document.createTextNode("ENGR100");
    new_cell.appendChild(new_text);
    // adjust column span
    document.getElementById("subject-table").rows[1].cells[0].colSpan = 2;

    // add all required courses to table
    var required_courses = rules["All"].slice(1); // get all courses except ENGR100
    var sem1 = [];
    var sem2 = [];
    semester_1_courses = semester_occurances["Semester 1"];
    for (var i in required_courses) { // find which semester each course is availiable in
        if (semester_1_courses.indexOf(required_courses[i]) != -1) {
            sem1.push(required_courses[i]);
        } else { // if not in semester 1, we assume it occurs in semester 2
            sem2.push(required_courses[i]);
        }
    }

    // add rows for required courses
    for (var i = 2; i < sem1.length+2; i++) {
        var new_row = subject_table.insertRow(i);
        var new_cell = new_row.insertCell(0);
        new_cell.className = "required";
        var new_text = document.createTextNode(sem1[i-2]);
        new_cell.appendChild(new_text);
        if (sem2.length >= 1) {
            var new_cell = new_row.insertCell(1);
            new_cell.className = "required";
            var new_text = document.createTextNode(sem2.splice(0,1));
            new_cell.appendChild(new_text);
        }
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
