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
    "Software":  ["MATH120", "COSC121", "COSC122"],
    "Computer": ["EMTH171", "COSC121"],
    "Electrical and Electronic": ["EMTH171", "COSC121"],
    "Mechatronics": ["EMTH171", "COSC121", "ENGR102"],
    "Mechanical": ["EMTH171", "ENGR102"],
    "Civil": ["EMTH171", "CHEM111", "ENGR102"],
    "Natural Resources": ["EMTH171", "CHEM111", "ENGR102"],
    "Forest": ["EMTH171", "CHEM111", "ENGR102"],
    "Chemical and Process": ["EMTH171", "CHEM111"]
}

// Semester: available subjects
semester_occurances = {
    "Semester 1": ["ENGR101", "EMTH118", "PHYS101", "COSC121", "CHEM111"],
    "Semester 2": ["ENGR102", "EMTH119", "EMTH171", "COSC121", "CHEM111"],
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
    checkbox.id = name;           // unique ID for each checkbox

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
            var eng_types = Object.keys(rules); // get list of eng types from keys in dictionary
            if (this.checked == false) {
                // set each of the checkboxes to unchecked
                for (var i = 1; i < eng_types.length; i++ ) {
                    document.getElementById(eng_types[i]).checked = false;
                    document.getElementById(eng_types[i]).closest("label").className = "";
                }
                // clear checked eng types list
                checked_eng_types = [];
            } else {
                // set each of the checkboxes to checked
                for (var i = 1; i < eng_types.length; i++ ) {
                    document.getElementById(eng_types[i]).checked = true;
                    document.getElementById(eng_types[i]).closest("label").className = "selected-eng";
                }
                // reset list of checked eng types to inclue all
                checked_eng_types = eng_types;
            }
        } else {
            var index = checked_eng_types.indexOf(this.value);
            if (this.checked) { // if selected then add to list of checked eng types
                checked_eng_types.push(this.value);
                this.closest("label").className = "selected-eng";
            } else { // else if unselected then remove from list of checked eng types
                checked_eng_types.splice(index, 1);
                this.closest("label").className = "";
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
    updateEngList(required_subjects);
    //updateTable(required_subjects);
    build_table(required_subjects); // test
}


function build_table(required_subjects) {
    table = document.getElementById("subject-table");

    for (var i in required_subjects) {

        var table_row = document.createElement("div");
        table_row.className = "table-row";

        var button = document.createElement("input");
        button.type = "Submit";
        button.value = required_subjects[i];
        button.id = required_subjects[i];
        button.className = "subject-button subject-label";
        table_row.appendChild(button);

        var label = document.createElement("label");
        label.value = required_subjects[i];
        label.className = "subject-label";
        label.appendChild(document.createTextNode(required_subjects[i]));
        table_row.appendChild(label);

        var label = document.createElement("label");
        label.value = required_subjects[i];
        label.className = "subject-label";
        label.appendChild(document.createTextNode(required_subjects[i]));
        table_row.appendChild(label);

        table.appendChild(table_row);
    }
}


// determine which subjects occur in each semester
// returns 2 separate lists
function semesterLists(required_subjects) {
    var sem1 = [];
    var sem2 = [];
    semester_1_subjects = semester_occurances["Semester 1"];
    semester_2_subjects = semester_occurances["Semester 2"];
    both_sem = [];
    for (var i in required_subjects) { // find which semester each subject is availiable in

        if (semester_1_subjects.indexOf(required_subjects[i]) != -1 && semester_2_subjects.indexOf(required_subjects[i]) != -1) {
            both_sem.push(required_subjects[i]);
        }
        if (semester_1_subjects.indexOf(required_subjects[i]) != -1) {
            sem1.push(required_subjects[i]);
        } else { // if not in semester 1, we assume it occurs in semester 2
            sem2.push(required_subjects[i]);
        }
    }
    return {
        sem1: sem1,
        sem2: sem2,
        both_sem: both_sem,
    };
}


// update table according to new list of required subjects
function updateTable(required_subjects) {

    var subject_table = document.getElementById("subject-table"); // delete all rows of table below ENGR100
    var num_rows = $("#subject-table tr").length;
    while (num_rows > 2) {
        subject_table.deleteRow(2);
        num_rows = $("#subject-table tr").length;
    }

    var sem1 = semesterLists(required_subjects).sem1;
    var sem2 = semesterLists(required_subjects).sem2;
    var both_sem = semesterLists(required_subjects).both_sem;

    default_subjects = rules["All"];

    for (var i = 2; i < sem1.length+2; i++) { // start at 2 because row 0 = semester headings, row 1 = ENGR100
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


// determine which eng types are possible based on subjects currently in table
function updateEngList(subjects) {
    for (var i in rules) {
        if (i == "All") {
            continue;
        }
        req_subjects = rules[i];
        count = 0;
        for (j = 0; j < req_subjects.length; j++) {
            if (subjects.indexOf(req_subjects[j]) == -1) {
                break;
            } else {
                count ++;
            }
        }
        // change class for label (for colour coding)
        element = document.getElementById(i).closest("label");
        if (element.className == "selected-eng") {
            continue;
        } else if (req_subjects.length == count) {
            element.className = "possible-eng";
        } else {
            element.className = "";
        }
    }
}
