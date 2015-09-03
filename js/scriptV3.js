/*
 * Author: Hayley van Waas, University of Canterbury
 * Date: September 2015
 *
 * This is an interactive designed to help students select which subjects to take in their first year of engineering at the University of Canterbury
 */


// TODO remove global variables
// TODO does not account for summer school

var checked_eng_types = [];
var checked_subjects = [];


// ENGR100 hardcoded separately in HTML
// Engineering type: required subjects
rules = {
    "All": ["ENGR101", "EMTH118", "EMTH119", "PHYS101"],
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

    // watch buttons for if clicked
    watchEngCB();

    updateReqSubjectList();

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


}


// watch the engineering checkboxes for change
function watchEngCB() {
    $("[name=1]").change(function() {
        // if "All" selected, automatically selects all engineering types
        if (this.value == "All") {
            count = 0;
            if (this.checked == false) {
                while (count <= 9) {
                    document.getElementById(count).checked = false;
                    checked_eng_types = [];
                    count++;
                }
            } else {
                while (count <= 9) {
                    document.getElementById(count).checked = true;
                    checked_eng_types = Object.keys(rules);
                    count++;
                }
            }
        } else {
            var index = checked_eng_types.indexOf(this.value);
            if (this.checked) { // if selected then add to list of checked eng types
                checked_eng_types.push(this.value);
            } else { // else if unselected then remove from list of checked eng types
                checked_eng_types.splice(index, 1);
            }
        }
        // update list of required subjects
        updateReqSubjectList();
    });

}


// TODO does not account for when checkboxes are unselected
// update list of required subjects depending on which checkboxes are clicked
function updateReqSubjectList() {

    var required_subjects = rules["All"].slice(); // gets a copy of subjects required for all courses

    for (var i in checked_eng_types) { // iterate through selected engineerying types
        subject_list = rules[checked_eng_types[i]]; // get subjects required for specific engineering type
        for (var j in subject_list) {
            // add subject to list of required subjects if it is not already there
            if (required_subjects.indexOf(subject_list[j]) == -1) {
                required_subjects.push(subject_list[j])
            }
        }
    }
    updateTable(required_subjects);
}


// determine which subjects occur in each semester
// returns 2 separate lists
function semesterLists(required_subjects) {
    var sem1 = [];
    var sem2 = [];
    semester_1_subjects = semester_occurances["Semester 1"];
    for (var i in required_subjects) { // find which semester each subject is availiable in
        if (semester_1_subjects.indexOf(required_subjects[i]) != -1) {
            sem1.push(required_subjects[i]);
        } else { // if not in semester 1, we assume it occurs in semester 2
            sem2.push(required_subjects[i]);
        }
    }
    return {
        sem1: sem1,
        sem2: sem2
    };
}


// update table according to new list of required subjects
function updateTable(required_subjects) {

    var subject_table = document.getElementById("subject-table");
    // delete all rows of table below ENGR100
    var num_rows = $("#subject-table tr").length;
    while (num_rows > 2) {
        subject_table.deleteRow(2);
        num_rows = $("#subject-table tr").length;
    }

    var sem1 = semesterLists(required_subjects).sem1;
    var sem2 = semesterLists(required_subjects).sem2;

    default_subjects = rules["All"];

    for (var i = 2; i < sem1.length+2; i++) { //start at 2 because row 0 = semester headings, row 1 = ENGR100
        var new_row = subject_table.insertRow(i);
        var new_cell = new_row.insertCell(0);
        subject = sem1[i-2];
        if (default_subjects.indexOf(subject) != -1){
            new_cell.className = "default";
        } else if (i > 5) {
            new_cell.className = "overflow";
        } else {
            new_cell.className = "added-subject";
        }
        var new_text = document.createTextNode(subject);
        new_cell.appendChild(new_text);
        if (sem2.length >= 1) {
            var new_cell = new_row.insertCell(1);
            subject = sem2.splice(0,1).toString();
            if (default_subjects.indexOf(subject) != -1){
                new_cell.className = "default";
            } else if (i > 5) {
            new_cell.className = "overflow";
            } else {
                new_cell.className = "added-subject";
            }
            var new_text = document.createTextNode(subject);
            new_cell.appendChild(new_text);
        }
    }

}


