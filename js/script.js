/*
 * Author: Hayley van Waas, University of Canterbury
 * Date: September 2015
 *
 * This is an interactive designed to help students select which subjects to take in their first year of engineering at the University of Canterbury
 */


// TODO remove global variables
// TODO functions need docstrings
// TODO update table on checkbutton click instead of rebuilding

var checked_eng_types = [];
var checked_subjects = [];

// initialise counters to check number of subjects in each semester
var sem1_count = 0;
var sem2_count = 0;

// Engineering type: required subjects
// ENGR100 hardcoded
rules = {
//    "All": ["ENGR101", "EMTH118", "EMTH119", "PHYS101"],
    "Software":  ["ENGR101", "EMTH118", "EMTH119", "MATH120",  "PHYS101", "COSC121", "COSC122"],
    "Computer": ["ENGR101", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "COSC121"],
    "Electrical and Electronic": ["ENGR101", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "COSC121"],
    "Mechatronics": ["ENGR101", "ENGR102", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "COSC121"],
    "Mechanical": ["ENGR101", "ENGR102", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "CHEM111"],
    "Civil": ["ENGR101", "ENGR102", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "CHEM111"],
    "Natural Resources": ["ENGR101", "ENGR102", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "CHEM111"],
    "Forest": ["ENGR101", "ENGR102", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "CHEM111"],
    "Chemical and Process": ["ENGR101", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "CHEM111"]
}

// Semester: available subjects
semester_occurances = {
    "Semester 1": ["ENGR101", "EMTH118", "PHYS101", "COSC121", "CHEM111"],
    "Semester 2": ["ENGR102", "EMTH119", "EMTH171", "COSC121", "CHEM111", "MATH120", "COSC122"],
    "Summer School": ["ENGR102", "COSC122"]
}


// on page load
$(document).ready(function() {

    var eng_types = Object.keys(rules); // get list of eng types from keys in dictionary
    // generate check box for each engineering type
    for (var i in eng_types) {
        generateEngCheckBoxes(eng_types[i], i);
    }
    // watch eng buttons for if clicked
    watchEngCB();

    updateTable([]); // test

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

    label.className = "span-3"; // class will only be added to first button
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


// react to subject button click
// TODO does not account for buttons marked as overflow
function subjectButtonClick(subject) {
    current_class = subject.className;
    column = current_class.slice(-9);
    if (current_class.indexOf("true") != -1) { //true is included in class
        subject.className = "false subject-button" + column;
        // decrease semester count
    } else { // class must have been false
        siblings = subject.closest("div").children;
        for (var i = 0; i < siblings.length; i++) { // each sibling except the last
            tag = siblings[i];
            if (tag.tagName == "INPUT") { // ignore labels
                // TODO: check classname to change count OR could just change every tag to false
                if (tag.className.indexOf("true") != -1) {
                    tag.className = "false subject-button" + column;
                    // decrease semester count
                }
            }
        }
        subject.className = "true subject-button" + column;
        // increase semester count
    }
}


// count subjects per semester
function semesterCount() {

    sem1_count = 0
    sem1_buttons = document.getElementsByName("column-1");
    for (var i = 0; i < sem1_buttons.length; i++) {
        if (sem1_buttons[i].className.indexOf("true") != -1) {
            sem1_count += 1;
        }
    }

    sem2_count = 0
    sem2_buttons = document.getElementsByName("column-2");
    for (var i = 0; i < sem2_buttons.length; i++) {
        if (sem2_buttons[i].className.indexOf("true") != -1) {
            sem2_count += 1;
        }
    }

    // use function to update classes of buttons
    updateOverflowButtons(sem1_buttons, sem1_count);
    updateOverflowButtons(sem2_buttons, sem2_count);

}


// change class applied to each button depending on number of buttons clicked in given semester
function updateOverflowButtons(button_list, count) {
    for (var i = 0; i < button_list.length; i++) {
        current_class = button_list[i].className;
        column = current_class.slice(-9);
        if (count > 4) { //4 = reccommended number of subjects per semester
            // if over 4, buttons should be coloured for overflow
            if (button_list[i].className.indexOf("true") != -1) {
                button_list[i].className = "overflow true subject-button" + column;
            }
        } else {
            if (button_list[i].className.indexOf("overflow") != -1 && button_list[i].className.indexOf("true") != -1) {
                button_list[i].className = "true subject-button" + column;
            }
        }
    }
}


// update list of required subjects depending on which checkboxes are clicked
function updateReqSubjectList() {

//    var required_subjects = rules["All"].slice();  // gets a copy of subjects required for all courses
    var required_subjects = [];

    for (var i in checked_eng_types) { // iterate through selected engineerying types
        subject_list = rules[checked_eng_types[i]]; // get subjects required for specific engineering type
        for (var j in subject_list) {
            // add subject to list of required subjects if it is not already there
            if (required_subjects.indexOf(subject_list[j]) == -1) {
                required_subjects.push(subject_list[j])
            }
        }
    }
    //updateEngList(required_subjects);
    updateTable(required_subjects);
}


// TODO break up this function into smaller functions!
// rebuilds table based on eng selection
function updateTable(required_subjects) {

    // delete all rows of table below default
    var subject_table = document.getElementById("subject-table");
    $(".table-row").remove();

    // ENGR100
    var table_row = document.createElement("div");
    table_row.className = "table-row";

    var col1_label = document.createElement("label");
    col1_label.className = "true place-holder column-1";
    col1_label.innerHTML = "ENGR100";
    table_row.appendChild(col1_label)

    var col2_label = document.createElement("label");
    col2_label.className = "true place-holder column-2";
    col2_label.innerHTML = "ENGR100";
    table_row.appendChild(col2_label)
    table_row.appendChild(buildLabel(" column-3"));

    subject_table.appendChild(table_row);

    for (var i in required_subjects) {

        // create new row
        var table_row = document.createElement("div");
        table_row.className = "table-row";

        var subject = required_subjects[i];
        selected = false;

        if (semester_occurances["Semester 1"].indexOf(subject) != -1) {
            selected = true;
            buildButton(table_row, subject, selected, " column-1");
        } else {
            table_row.appendChild(buildLabel(" column-1"));
        }

        if (semester_occurances["Semester 2"].indexOf(subject) != -1) {
            if (selected == true) {
                selected = false;
            } else {
                selected = true;
            }
            buildButton(table_row, subject, selected, " column-2");
        } else {
            table_row.appendChild(buildLabel(" column-2"));
        }

        if (semester_occurances["Summer School"].indexOf(subject) != -1) {
            selected = false;
            buildButton(table_row, subject, selected, " column-3");
        } else {
            table_row.appendChild(buildLabel(" column-3"));
        }

        subject_table.appendChild(table_row);

    }


    // gives message when course has prerequisites
    var message = document.getElementById("message");
    message.innerHTML = "";

    // cosc122
    if (required_subjects.indexOf("COSC122") != -1) {
        var p = document.createElement("p");
        p.innerHTML = "Note: COSC121 can be taken in either semester, but only if you are not taking COSC122.";
        message.appendChild(p);
    }
    if (required_subjects.indexOf("CHEM111") != -1) {
        var p = document.createElement("p");
        p.innerHTML = "Note: CHEM111 can be taken in either semester, but only if you are not taking CHEM122.";
        message.appendChild(p);
    }

    semesterCount();
    updateEngList();
}


//build button element for table
function buildButton(table_row, subject, selected, column) {
    /* input:
     *   - new table row element
     *   - subject name
     *   - column number
     */
    var button = document.createElement("input");

    button.type = "Submit";
    button.name = column.slice(-8); //strip leading whitespace
    button.value = subject;
    button.id = subject;
    button.onclick = function() { subjectButtonClick(button); semesterCount(); updateEngList(); };

    button.className = selected + " subject-button" + column;
    table_row.appendChild(button);

}


// build label element for table
function buildLabel(column) {
    var label = document.createElement("label");
    label.className = "empty-place-holder" + column;
    return label;
}


// determine which eng types are possible based on subjects currently in table
function updateEngList() {

    selected_subjects = document.getElementsByClassName("true subject-button");

    subjects = [];

    for (var i in selected_subjects) {
        subjects.push(selected_subjects[i].value);
    }

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
            if (req_subjects.length == count) {
                continue;
            } else {
                element.className = "";
            }
        } else if (req_subjects.length == count) {
            element.className = "possible-eng";
        } else {
            element.className = "";
        }
    }
}
