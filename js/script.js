/*
 * Author: Hayley van Waas, University of Canterbury
 * Date: September 2015
 *
 * This is a webpage designed to help new students select which subjects to take in their Intermediate Engineering Year at the University of Canterbury
 */

// TODO some subjects can't be taken at the same time
// TODO deal with global variables

rules = {
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

semester_occurances = {
    "Semester 1": ["ENGR101", "EMTH118", "MATH101", "EMTH210", "PHYS111", "PHYS101", "COSC121", "CHEM114",  "CHEM111"],
    "Semester 2": ["ENGR102", "EMTH118", "EMTH119", "EMTH171", "PHYS101", "COSC121", "CHEM111", "MATH120", "COSC122"],
    "Summer School": ["ENGR102", "EMTH119", "COSC122"]
}


// watches radio buttons for change
$("input[type=radio]").change(function() {
    if (this.checked == true) {
        siblings = $(this).siblings();
        for (var i in siblings) {
            if (siblings[i].tagName == "LABEL") {
                siblings[i].className = "false";
            }
        }
        $(this).nextAll("label")[0].className = "true";
    }
});


// changes the rules based on ncea background when user clicks "save" button
function adjustRules() {

    var prerequisites = {
        "star-maths": 0,
        "l3-maths": 0,
        "differentiation": 0,
        "integration": 0,
        "l3-physics": 0,
        "l3-chemistry": 0,
        "l2-chemistry": 0,
        "endorsement": 0
    }

    var new_rules = getRules()[0];
    var new_semester_occurances = getRules()[1];

    var radio_btns = document.forms["radio-btns"].getElementsByTagName("input");

    for (var i in radio_btns) {
        btn = radio_btns[i];
        if (btn.checked == true) {
            prerequisites[btn.name] = parseInt(btn.value);
        }
    }

    if (prerequisites["star-maths"] == 1) {
        // change EMTH118 to EMTH210 and remove EMTH119
        for (var i in new_rules) {
            var subjects = new_rules[i];
            var emth118_index = subjects.indexOf("EMTH118");
            if (emth118_index != -1) {
                subjects[emth118_index] = "EMTH210";
            }
            var emth119_index = subjects.indexOf("EMTH119");
            if (emth119_index != -1) {
                subjects.splice(emth119_index, 1);
            }
        }
    } else if (prerequisites["l3-maths"] == 0 || prerequisites["differentiation"] == 0 || prerequisites["differentiation"] == 0) {
        // add MATH101
        // add PHYS111
        // remove PHYS101 from semester 1
        // remove EMTH118 from semester 1
        // remove EMTH119 from semester 2
        for (var i in new_rules) {
            var subjects = new_rules[i];
            subjects.push("MATH101");
            subjects.push("PHYS111");
        }
        var phys101_index = new_semester_occurances["Semester 1"].indexOf("PHYS101");
        new_semester_occurances["Semester 1"].splice(phys101_index, 1);
        var emth118_index = new_semester_occurances["Semester 1"].indexOf("EMTH118");
        new_semester_occurances["Semester 1"].splice(emth118_index, 1);
        var emth119_index = new_semester_occurances["Semester 2"].indexOf("EMTH119");
        new_semester_occurances["Semester 2"].splice(emth119_index, 1);
    }

    if (prerequisites["l3-physics"] == 0) {
        // add PHYS111
        // remove PHYS101 from semester 1
        for (var i in new_rules) {
            var subjects = new_rules[i];
            var phys111_index = subjects.indexOf("PHYS111");
            if (phys111_index == -1) { // make sure PHYS111 hasn't already been added
                subjects.push("PHYS111");
            }
        }
        var phys101_index = new_semester_occurances["Semester 1"].indexOf("PHYS101");
        if (phys101_index != -1) { // check PHYS101 hasn't already been removed
            new_semester_occurances["Semester 1"].splice(phys101_index, 1);
        }
    }

    if (prerequisites["l3-chemistry"] == 0) {
        // add CHEM114
        // remove CHEM111 from semester 1
        for (var i in new_rules) {
            var subjects = new_rules[i];
            var chem111_index = subjects.indexOf("CHEM111");
            if (chem111_index != -1) { // if CHEM111 in list, add CHEM114
                subjects.push("CHEM114");
            }
        }
        var chem111_index = new_semester_occurances["Semester 1"].indexOf("CHEM111");
        new_semester_occurances["Semester 1"].splice(chem111_index, 1);
        if (prerequisites["l2-chemistry"] == 0) {
            // TODO note: summer recommended
         } else { //l2-chemistry == 1
            // TODO note: talk to student advisors
         }
     }

    if (prerequisites["endorsement"] == 1) {
        // TODO note: talk to course advisors
    }

    rules = new_rules;
    semester_occurances = new_semester_occurances;

    console.log(rules["Mechanical"]);

    // get list of eng types from keys in dictionary
    var eng_types = Object.keys(rules);

    // clear existing checkboxes
    var checkboxes = document.getElementById("eng_options");
    checkboxes.innerHTML = "";

    // generate check box for each engineering type
    for (var i in eng_types) {
        generateEngCheckBoxes(eng_types[i]);
    }

    // empty list of selected eng types to start with
    var checked_eng_types = [];
    // watch eng buttons for if clicked
    watchEngCB(checked_eng_types);
    updateTable([]);

    // display the semester planner part of the page
    document.getElementsByClassName("sem-planner")[0].style.display = "block";
}

// function to store rules

function getRules(rules, semester_occurances) {
     //Takes no input
     //Returns array of length 2 - [eng rules, semester occurances]

    // Dictionary for eng rules, maps required subjects to eng type
    // NOTE: ENGR100 is hardcoded therefore not included in the dictionary
    var orig_rules = {
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

    // Dictionary maps available subjects to semester
    var orig_semester_occurances = {
        "Semester 1": ["ENGR101", "EMTH118", "MATH101", "EMTH210", "PHYS111", "PHYS101", "COSC121", "CHEM114",  "CHEM111"],
        "Semester 2": ["ENGR102", "EMTH118", "EMTH119", "EMTH171", "PHYS101", "COSC121", "CHEM111", "MATH120", "COSC122"],
        "Summer School": ["ENGR102", "EMTH119", "COSC122"]
    }

    return [orig_rules, orig_semester_occurances];
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

    // get all buttons in the third column (summer school) and check if they are set to true
    var summer_count = 0
    var summer_buttons = document.getElementsByName("column-3");
    for (var i = 0; i < summer_buttons.length; i++) {
        if (summer_buttons[i].className.indexOf("true") != -1) {
            summer_count += 1;
        }
    }

    // update classes of buttons depending on number in each semester just calculated
    // last parameter is max number of subjects for that semester
    updateOverflowButtons(sem1_buttons, sem1_count, 4);
    updateOverflowButtons(sem2_buttons, sem2_count, 4);
    updateOverflowButtons(summer_buttons, summer_count, 2);
    updateFreeSubjectInputs(sem1_count, sem2_count, 4);

}


// change class applied to each button depending on number of buttons clicked in given semester
function updateOverflowButtons(button_list, count, threshold) {
    /* Input: list of buttons in the same column, the number set as true in that column
     * Output: none
     */

    if (button_list.length > 0) {
        var current_class = button_list[0].className;
        var column = current_class.slice(-9);

        // change class to overflow if over threshold, else remove overflow class
        if (count > threshold) {
            for (var i = 0; i < button_list.length; i++) {
                var current_class = button_list[i].className;
                // if over threshold, buttons should be coloured for overflow
                if (button_list[i].className.indexOf("true") != -1) {
                    button_list[i].className = "overflow true subject-button" + column;
                }
            }
        } else {
            for (var i = 0; i < button_list.length; i++) {
                var current_class = button_list[i].className;
                if (button_list[i].className.indexOf("overflow") != -1 && button_list[i].className.indexOf("true") != -1) {
                    button_list[i].className = "true subject-button" + column;
                }
            }
        }
    }
}


function updateFreeSubjectInputs(sem1_count, sem2_count, threshold) {

    var num_sem1_spaces = threshold - sem1_count;
    var num_sem2_spaces = threshold - sem2_count;

    var subject_table = document.getElementById("subject-table");

    while (num_sem1_spaces > 0 || num_sem2_spaces > 0) {
    console.log(num_sem1_spaces, num_sem2_spaces);
        var table_row = document.createElement("div");
        table_row.className = "table-row";
        if (num_sem1_spaces > 0) {
            table_row.appendChild(buildFreeSpace(" column-1"));
            num_sem1_spaces -= 1;
        } else {
            table_row.appendChild(buildLabel(" column-1"));
        }
        if (num_sem2_spaces > 0) {
            table_row.appendChild(buildFreeSpace(" column-2"));
            num_sem2_spaces -= 1;
        } else {
            table_row.appendChild(buildLabel(" column-2"));
        }
        table_row.appendChild(buildLabel(" column-3"));
        subject_table.appendChild(table_row);
    }
}


// update list of required subjects depending on which checkboxes are clicked
function updateReqSubjectList(checked_eng_types) {
    /* Input: list of selected eng types
     * Output: none
     */

    // get rules for what subjects are required for each eng discipline

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
            if (selected == true) {
                selected = false;
            } else {
                selected = true;
            }
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
    if (required_subjects.indexOf("CHEM111") != -1) {
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


function buildFreeSpace(column) {
    /* Input: column number
     * Output: label element
     */
    var input = document.createElement("input");
    input.type = "text";
    input.className = "elective" + column;
    input.value = "Other elective";
    return input;
}


// TODO Bug: some eng types removed when still possible
// determine which eng types are possible based on subjects currently in table
function updateEngList() {
    /* Input: none
     * Output: none
     */

    // get rules for what subjects are required for each eng discipline
    var selected_eng = document.getElementsByClassName("selected-eng");

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

    // for each of the selected eng types, check if all the required subjects have been selected
    for (var i in selected_eng) {
        if (selected_eng[i].innerText == undefined) {
            continue;
        }
        var req_subjects = rules[selected_eng[i].innerText];
        var count = 0;
        for (j = 0; j < req_subjects.length; j++) {
            if (subjects.indexOf(req_subjects[j]) == -1) {
                break;
            } else {
                count ++;
            }
        }
        // change class for eng type if it available depending on subject selection
        var element = document.getElementById(selected_eng[i].innerText).closest("label");
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
