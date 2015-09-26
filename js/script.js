/*
 * Author: Hayley van Waas, University of Canterbury
 * Date: September 2015
 *
 * This is a webpage designed to help new students select which subjects to take in their Intermediate Engineering Year at the University of Canterbury
 */


// on page load
$(document).ready(function() {

    // get rules for what subjects are required for each eng discipline
    var rules = getRules()[0];

    // get list of eng types from keys in dictionary
    var eng_types = Object.keys(rules);

    // generate check box for each engineering type
    for (var i in eng_types) {
        generateEngCheckBoxes(eng_types[i]);
    }

    // empty list of selected eng types to start with
    var checked_eng_types = [];
    // watch eng buttons for if clicked
    watchEngCB(checked_eng_types);

    // table empty initially
    updateTable([]);


});


$("input[type=radio]").change(function() {
    console.log(this.nextAll)
    if (this.checked == true) {
        $(this).nextAll("label")[0].className = "true";
    } else {
        $(this).nextAll("label")[0].className = "false";
    }
});

// function to store rules
function getRules() {
    /*
     * Takes no input
     * Returns array of length 2 - [eng rules, semester occurances]
     */

    // Dictionary for eng rules, maps required subjects to eng type
    // NOTE: ENGR100 is hardcoded therefore not included in the dictionary
    // Asterix in COSC121 and CHEM111 to indicate further information given underneath table
    var rules = {
        "Software":  ["ENGR101", "EMTH118", "EMTH119", "MATH120",  "PHYS101", "COSC121*", "COSC122"],
        "Computer": ["ENGR101", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "COSC121*"],
        "Electrical and Electronic": ["ENGR101", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "COSC121*"],
        "Mechatronics": ["ENGR101", "ENGR102", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "COSC121*"],
        "Mechanical": ["ENGR101", "ENGR102", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "CHEM111*"],
        "Civil": ["ENGR101", "ENGR102", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "CHEM111*"],
        "Natural Resources": ["ENGR101", "ENGR102", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "CHEM111*"],
        "Forest": ["ENGR101", "ENGR102", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "CHEM111*"],
        "Chemical and Process": ["ENGR101", "EMTH171", "EMTH118", "EMTH119", "PHYS101", "CHEM111*"]
    }

    // Dictionary maps available subjects to semester
    var semester_occurances = {
        "Semester 1": ["ENGR101", "EMTH118", "PHYS101", "COSC121*", "CHEM111*"],
        "Semester 2": ["ENGR102", "EMTH119", "EMTH171", "COSC121*", "CHEM111*", "MATH120", "COSC122"],
        "Summer School": ["ENGR102", "COSC122"]
    }

    return [rules, semester_occurances];
}

function handler() {
    console.log("here");
}

// create checkboxes for each eng type individually
function generateEngCheckBoxes(name) {
    /* Input: name of a subject
     * Output: none
     */

    // create the necessary elements
    var label = document.createElement("label");
    var description = document.createTextNode(name);
    var checkbox = document.createElement("input");

    // assign attributes to the checkbox
    checkbox.type = "checkbox";    // make the element a checkbox
    checkbox.name = 1;             // give it a name we can check in watchEngCB()
    checkbox.value = name;         // make its value the name the subject
    checkbox.id = name;            // unique ID for each checkbox is the name of the subject

    label.className = "span-3";    // class is only be added to first button
    label.appendChild(checkbox);   // add the box to the element
    label.appendChild(description);// add the description to the element

    // add the label element to the div (hard coded in html)
    document.getElementById("eng_options").appendChild(label);

}


// watch the engineering checkboxes for change
function watchEngCB(checked_eng_types) {
    /* Input: list of eng_types that have been selected
     * Output: none
     */

    $("[name=1]").change(function() {
        var index = checked_eng_types.indexOf(this.value);
        // if selected then add to list of checked eng types and update the class
        if (this.closest("label").className != "selected-eng") {
            checked_eng_types.push(this.value);
            this.closest("label").className = "selected-eng";
        // else if unselected then remove from list of checked eng types and update the class
        } else {
            checked_eng_types.splice(index, 1);
            this.closest("label").className = "";
        }

        // update list of required subjects
        updateReqSubjectList(checked_eng_types);
    });
}


// react to subject button click
function subjectButtonClick(subject) {
    /* Input: subject button object
     * Output: none
     */

    // get class of subject that was clicked
    var current_class = subject.className;
    // last part of class is the column number
    var column = current_class.slice(-9);

    // if true is included in the class - i.e. was selected, now we are wanting to unselect it
    if (current_class.indexOf("true") != -1) {
        subject.className = "false subject-button" + column;
    // else must have been false - i.e. was unselected, now we are wanting to select it
    } else {
        // get siblings in div - i.e. objects in same row and if they are inputs, set them to false
        var siblings = subject.closest("div").children;
        for (var i = 0; i < siblings.length; i++) { // each sibling except the last
            var tag = siblings[i];
            if (tag.tagName == "INPUT") { // ignore labels
                tag.className = "false subject-button" + column;
            }
        }
        // set the clicked subject to true
        subject.className = "true subject-button" + column;
    }
}


// count subjects per semester
function semesterCount() {
    /* Input: none
     * Output: none
     */

    // get all buttons in the first column (semester one) and check if they are set to true
    var sem1_count = 0
    var sem1_buttons = document.getElementsByName("column-1");
    for (var i = 0; i < sem1_buttons.length; i++) {
        if (sem1_buttons[i].className.indexOf("true") != -1) {
            sem1_count += 1;
        }
    }

    // get all buttons in the second column (semester two) and check if they are set to true
    var sem2_count = 0
    var sem2_buttons = document.getElementsByName("column-2");
    for (var i = 0; i < sem2_buttons.length; i++) {
        if (sem2_buttons[i].className.indexOf("true") != -1) {
            sem2_count += 1;
        }
    }

    // NOTE: no counter for summer school because not enough subjects in the rules for an overflow to exist

    // update classes of buttons depending on number in each semester just calculated
    updateOverflowButtons(sem1_buttons, sem1_count);
    updateOverflowButtons(sem2_buttons, sem2_count);

}


// change class applied to each button depending on number of buttons clicked in given semester
function updateOverflowButtons(button_list, count) {
    /* Input: list of buttons in the same column, the number set as true in that column
     * Output: none
     */

    // for each button get the current class name, and check if it needs to be set overflow or not
    for (var i = 0; i < button_list.length; i++) {
        var current_class = button_list[i].className;
        var column = current_class.slice(-9);
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
function updateReqSubjectList(checked_eng_types) {
    /* Input: list of selected eng types
     * Output: none
     */

    // get rules for what subjects are required for each eng discipline
    var rules = getRules()[0];

    var required_subjects = [];

    // for each selected eng type, get the required subjects and add them to the lsit
    for (var i in checked_eng_types) {
        subject_list = rules[checked_eng_types[i]];
        for (var j in subject_list) {
            // add subject to list of required subjects if it is not already there
            if (required_subjects.indexOf(subject_list[j]) == -1) {
                required_subjects.push(subject_list[j])
            }
        }
    }

    updateTable(required_subjects);
}


// rebuilds table based on eng selection
function updateTable(required_subjects) {
    /* Input: list of subjects needed in table
     * Output: none
     */

    // delete all rows of table
    var subject_table = document.getElementById("subject-table");
    $(".table-row").remove();

    // rebuild table

    // ENGR100 placed separately - spans two columns, set as a place holder
    //  create div for new row
    var table_row = document.createElement("div");
    table_row.className = "table-row";

    // build each column and attach to row
    var col1_label = document.createElement("label");
    col1_label.className = "true place-holder column-1";
    col1_label.innerHTML = "ENGR100*";
    table_row.appendChild(col1_label)

    var col2_label = document.createElement("label");
    col2_label.className = "true place-holder column-2";
    col2_label.innerHTML = "ENGR100*";
    table_row.appendChild(col2_label)
    table_row.appendChild(buildLabel(" column-3"));

    // add new row to the table
    subject_table.appendChild(table_row);

    // place all other subjects
    var semester_occurances = getRules()[1];

    // for each subject: build a div (new row) and attach columns
    for (var i in required_subjects) {

        // create new row
        var table_row = document.createElement("div");
        table_row.className = "table-row";

        var subject = required_subjects[i];
        var selected = false;

        // for each semester, builds button of label depending on whether the subject is avaliable in that semester

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
    // TODO hardcoded which subjects to check for - could be new dictionary instead
    var message = document.getElementById("message");
    message.innerHTML = "<p>*ENGR100 is an Academic Writing Assessment and is an EFTS free, zero-fee course.</p>";

    // cosc122
    if (required_subjects.indexOf("COSC122") != -1) {
        var p = document.createElement("p");
        p.innerHTML = "*COSC121 can be taken in either semester, but only if you are not taking COSC122.";
        message.appendChild(p);
    }
    if (required_subjects.indexOf("CHEM111*") != -1) {
        var p = document.createElement("p");
        p.innerHTML = "*CHEM111 can be taken in either semester, but only if you are not taking CHEM122.";
        message.appendChild(p);
    }

    // count number of subjects in each semester and update the list of eng disciplines possible
    semesterCount();
    updateEngList();
}


//build button element for table
function buildButton(table_row, subject, selected, column) {
    /* Input: new table row element, subject name, column number
     * Output: none
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
    /* Input: column number
     * Output: label element
     */
    var label = document.createElement("label");
    label.className = "empty-place-holder" + column;
    return label;
}


// determine which eng types are possible based on subjects currently in table
function updateEngList() {
    /* Input: none
     * Output: none
     */

    console.log("here");

    // get rules for what subjects are required for each eng discipline
    var rules = getRules()[0];

    // get selected subjects by class name
    var selected_subjects = document.getElementsByClassName("true subject-button");

    var subjects = [];

    // for each selected subject, add name to list of subjects
    for (var i in selected_subjects) {
        subject_name = selected_subjects[i].value;
        if (subject_name == undefined) {
            continue;
        } else if (subjects.indexOf(subject_name) == -1) {
            subjects.push(subject_name);
        }
    }

    // for each of the eng types, check if all the required subjects have been selected
    for (var i in rules) {
        var req_subjects = rules[i];
        var count = 0;
        for (j = 0; j < req_subjects.length; j++) {
            if (subjects.indexOf(req_subjects[j]) == -1) {
                break;
            } else {
                count ++;
            }
        }
        // change class for eng type if it available depending on subject selection
        var element = document.getElementById(i).closest("label");
        if (element.className == "selected-eng") {
            if (req_subjects.length != count) {
                element.className = "";
            }
        } else if (req_subjects.length == count) {
            element.className = "selected-eng";
            updateTable(subjects);
        } else {
            element.className = "";
        }
    }
}
