/*
 * Author: Hayley van Waas, University of Canterbury
 * Date: November 2015
 * Minor Edits by Conan Fee, UNiversity of Canterbury
 * Date: November 2015
 *
 * This is a webpage designed to help new students select which subjects to take in their Intermediate Engineering Year at the University of Canterbury
 */

// TODO deal with global variables
// TODO split up functions
// TODO work out where updateTable and updateEngList need to be called - they call each other, so only one needs to be called at a time
// TODO table reorders itself when rows added/removed - could be better if it stayed constant?

// these are each of the Yes/No questions at top of page
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

// subjects required for each engineering type
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

// lists which subjects are available in each semester
semester_occurances = {
    "Semester 1": ["ENGR101", "EMTH118", "MATH101", "EMTH210", "PHYS111", "PHYS101", "COSC121", "CHEM114",  "CHEM111"],
    "Semester 2": ["ENGR102", "EMTH118", "EMTH119", "EMTH171", "PHYS101", "COSC121", "CHEM111", "MATH120", "COSC122"],
    "Summer School": ["ENGR102", "EMTH119", "COSC122"]
}

common_subjects = ["ENGR101", "PHYS101", "EMTH118", "EMTH119"];

// checks for change in page size
$(document).ready(function() {
    changeDivLayout();
    window.addEventListener('resize', function(){ changeDivLayout() });
});


// changes layout of divs for different page sizes (i.e. shifts key and tables to different order on smaller page size)
function changeDivLayout() {
    /* Input: none
     * Output: none
     */

    var sem_planner_section = document.getElementsByClassName("sem-planner")[0];
    var key_div = document.getElementById("key");
    var eng_options_div = document.getElementById("eng-options");
    var message_div = document.getElementById("message");
    var subject_table_div = document.getElementById("subject-table");
    var left_div = document.getElementById("left");

    var tables_div = document.getElementById("tables");
    // if page is less than 853 pixels wide, set lineary order of elements in sem-planner
    if (self.innerWidth <= 835) {
        tables_div.appendChild(eng_options_div);
        tables_div.appendChild(key_div);
        tables_div.appendChild(subject_table_div);
        tables_div.appendChild(message_div);
    } else {
        //sem_planner_section.appendChild(key_div);
        left_div.appendChild(eng_options_div);
        left_div.appendChild(message_div);
        tables_div.appendChild(left_div);
        tables_div.appendChild(subject_table_div);
        $("#key").insertBefore(tables_div);
    }
}


// watches radio buttons for change (prerequisite Yes/No questions are radio buttons)
$("input[type=radio]").change(function() {
    /* Input: none
     * Output: none
     */
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


// changes the rules based on NCEA background when user clicks "save" button
//NOTE: for a different background to NCEA, this function should be rewritten
function adjustRules() {
    /* Input: none
     * Output: none
     */

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
    } else if (prerequisites["l3-maths"] == 0 || prerequisites["differentiation"] == 0 || prerequisites["integration"] == 0) {
        // add MATH101
        // remove PHYS101 from semester 1
        // remove EMTH118 from semester 1
        // remove EMTH119 from semester 2
        for (var i in new_rules) {
            var subjects = new_rules[i];
            subjects.push("MATH101");
            // add to common subjects since prerequisites for other subjects
            common_subjects.push("MATH101");
        }
        var phys101_index = new_semester_occurances["Semester 1"].indexOf("PHYS101");
        new_semester_occurances["Semester 1"].splice(phys101_index, 1);
        var emth118_index = new_semester_occurances["Semester 1"].indexOf("EMTH118");
        new_semester_occurances["Semester 1"].splice(emth118_index, 1);
        var emth119_index = new_semester_occurances["Semester 2"].indexOf("EMTH119");
        new_semester_occurances["Semester 2"].splice(emth119_index, 1);
        var engr102_index = new_semester_occurances["Semester 2"].indexOf("ENGR102");
        new_semester_occurances["Semester 2"].splice(engr102_index, 1);        
    }

    if (prerequisites["l3-physics"] == 0) {
        // add PHYS111
        // remove PHYS101 from semester 1
        for (var i in new_rules) {
            var subjects = new_rules[i];
            var phys111_index = subjects.indexOf("PHYS111");
            if (phys111_index == -1) { // make sure PHYS111 hasn't already been added
                subjects.push("PHYS111");
                common_subjects.push("PHYS111");
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
     }

    if (prerequisites["endorsement"] == 1) {
        // note: talk to course advisors
        document.getElementById("endorsement").style.display = "block";
    } else {
        document.getElementById("endorsement").style.display = "none";
    }

    rules = new_rules;
    semester_occurances = new_semester_occurances;

    // get list of eng types from keys in dictionary
    var eng_types = Object.keys(rules);

    // clear existing checkboxes
    var checkboxes = document.getElementById("eng-options");
    checkboxes.innerHTML = "";

    // generate check box for each engineering type
    for (var i in eng_types) {
        generateEngCheckBoxes(eng_types[i]);
    }

    // empty list of selected eng types to start with
    var checked_eng_types = [];
    // watch eng buttons for if clicked
    watchEngCB();
    updateTable([]);

    // display the semester planner part of the page
    document.getElementsByClassName("sem-planner")[0].style.display = "block";

}


// function to store rules
function getRules(rules, semester_occurances) {
     /* Input: dictionary of rules and semester occurances as input
      * Output: array of length 2 - [eng rules, semester occurances]
      */

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
    checkbox.draggable = false;

    label.appendChild(checkbox);   // add the box to the element
    label.appendChild(description);// add the description to the element
    label.draggable = false;

    // add the label element to the div (hard coded in html)
    document.getElementById("eng-options").appendChild(label);

}


// watch the engineering checkboxes for change
function watchEngCB() {
    /* Input: none
     * Output: none
     */

    $("[name=1]").change(function() {
        var selected_eng = document.getElementsByClassName("selected-eng");
        var checked_eng_types = [];
        for (var i = 0; i < selected_eng.length; i++) {
            checked_eng_types.push(selected_eng[i].childNodes[0].id);
        }
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
function checkSubjectPrerequisites(subject) {
    /* Input: subject button object
     * Output: none
     */

    var subject_name = subject.id.slice(0, 7);

    // subject pairs where order matters
    var subject_clashes = {
        "COSC121": "COSC122",
        "COSC122": "COSC121",
        "EMTH118": "EMTH119",
        "EMTH119": "EMTH118"
    }

    //var clash_subject_keys = Object.keys(subject_clashes);
    if (Object.keys(subject_clashes).indexOf(subject_name) != -1) { // subject where order matters
        // find it's pair's name, check if also selected
        var compliment_subject = subject_clashes[subject_name];
        var compliment_row = document.getElementsByClassName(compliment_subject);
        if (compliment_row.length > 0) { // compliment subject also in table
            checkSubjectOrder(subject, compliment_subject);
        }
    }
}


// checks if by clicking a subject, another has to be moved (e.g. COSC121 and COSC122 cannot be in the same semester)
function checkSubjectOrder(shifted_subject, compliment_subject) {
    /* Input: the subject clicked, it's compliment subject, e.g. EMTH118 compliment = EMTH119
     * Output: none
     */

    // column the clicked subject is now in
    var shifted_col = shifted_subject.id.slice(8);

    var compliment_options = [];
    // all elements in the same row as the compliment subject
    var compliment_row = document.getElementsByClassName(compliment_subject)[0].childNodes;
    // build list of possible columns to shift compliment subject
    for (var i in compliment_row) {
        if (compliment_row[i].className == undefined) { //undefined included in list by getElementsByClassName function
            continue;
        }
        var cell = compliment_row[i];
        if (cell.className == "cell") {
            var div = cell.childNodes[0];
            if (div.className.indexOf("true") != -1) {
                var selected_compliment = div;
                var compliment_col = div.id.slice(-8);
            } else {
                if (div.tagName != "LABEL") {
                    compliment_options.push(div);
                }
            }
        }
    }

    // try and shift the compliment subject if it is in the same column as the selected subject
    if (shifted_col == compliment_col) {
        // if the length of this list is 0, there are no other semesters that the subject occurs in
        if (compliment_options.length == 0) {
            // TODO add colour for subject clash
        } else { // it is able to be moved
            swapDivs(selected_compliment, compliment_options[0]);
        }
    }

}


// count subjects per semester
function semesterCount() {
    /* Input: none
     * Output: none
     */

    // get all buttons in the first column (semester one) and check if they are set to true
    var sem1_buttons = document.getElementsByClassName("true subject-button column-1");
    var sem1_count = sem1_buttons.length;


    // get all buttons in the second column (semester two) and check if they are set to true
    var sem2_buttons = document.getElementsByClassName("true subject-button column-2");
    var sem2_count = sem2_buttons.length;

    // get all buttons in the third column (summer school) and check if they are set to true
    var summer_buttons = document.getElementsByClassName("true subject-button column-3");
    var summer_count = summer_buttons.length;

    // update classes of buttons depending on number in each semester just calculated
    // last parameter is max number of subjects for that semester
    var overflow = [];
    overflow.push(updateOverflowButtons(sem1_buttons, sem1_count, 4));
    overflow.push(updateOverflowButtons(sem2_buttons, sem2_count, 4));
    overflow.push(updateOverflowButtons(summer_buttons, summer_count, 2));
    updateFreeSubjectInputs(sem1_count, sem2_count, 4);

    if (overflow.indexOf(true) != -1) {
        $("#key-overflow").animate({"font-size": "15px"}, 300);
    } else {
        $("#key-overflow").animate({"font-size": "10px"}, 300);
    }

}


// change class applied to each button depending on number of buttons clicked in given semester
function updateOverflowButtons(button_list, count, threshold) {
    /* Input: list of buttons in the same column, the number set as true in that column and the number of subjects allowed before overflow is reached
     * Output: boolean value for if overflow is true or false
     */

    // check which overflow message to hide/show
    if (count > threshold) {
        if (threshold == 4) { // i.e. semester 1 or 2
            document.getElementById("semester-overflow").style.display = "block";
        } else { //summer
            document.getElementById("summer-overflow").style.display = "block";
        }
    } else {
        if (threshold == 4) { // i.e. semester 1 or 2
            document.getElementById("semester-overflow").style.display = "none";
        } else { //summer
            document.getElementById("summer-overflow").style.display = "none";
        }
    }

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
            return true;
        } else {
            for (var i = 0; i < button_list.length; i++) {
                var current_class = button_list[i].className;
                if (button_list[i].className.indexOf("overflow") != -1 && button_list[i].className.indexOf("true") != -1) {
                    button_list[i].className = "true subject-button" + column;
                }
            }
            if (threshold == 4) { // i.e. semester 1 or 2
                document.getElementById("semester-overflow").style.display = "none";
            } else { //summer
                document.getElementById("summer-overflow").style.display = "none";
            }
            return false;
        }
    }
}

// recursively deletes all free elective spaces
function removeExistingElectiveRows(elective_inputs) {
    /* Input: remaining elective input boxes
     * Output: none
     */
    if (elective_inputs.length > 0) { // if there are actually more electives to delete
        elective_inputs[0].parentNode.removeChild(elective_inputs[0]); // remove the whole row
        removeExistingElectiveRows(document.getElementsByClassName("elective-row")); // call the function again with the remaining elective spaces
    }
    return;
}

// place elective input boxes
function updateFreeSubjectInputs(sem1_count, sem2_count, threshold) {
    /* Input: number of sem1 subjects, number of sem2 subjects, number of subjects allowed before overflow is reached
     * Output: none
     */

    // clear the existing rows with free elective spaces
    removeExistingElectiveRows(document.getElementsByClassName("elective-row"));

    var num_sem1_spaces = threshold - sem1_count;
    var num_sem2_spaces = threshold - sem2_count;

    var subject_table = document.getElementById("subject-table");

    while (num_sem1_spaces > 0 || num_sem2_spaces > 0) {
        var table_row = document.createElement("div");
        table_row.className = "elective-row table-row";
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


// update list of required subjects depending on which eng checkboxes are clicked
function updateReqSubjectList(checked_eng_types) {
    /* Input: list of selected eng types
     * Output: none
     */
    var required_subjects = [];

    // for each selected eng type, get the required subjects and add them to the list
    for (var i in checked_eng_types) {
        // get rules for what subjects are required for each eng discipline
        var subject_list = rules[checked_eng_types[i]];
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

    // ENGR100 placed separately - spans two columns, set as a long place holder
    //  create div for new row
    var table_row = document.createElement("div");
    table_row.className = "table-row";

    // build each column and attach to row
    var table_row = document.createElement("label");
    table_row.className = "table-row true long-place-holder";
    table_row.innerHTML = "ENGR100 <p>(compulsory no-credit, no-fees course for Academic Writing Assessment purposes only)</p>";

    // add new row to the table
    subject_table.appendChild(table_row);

    // place all other subjects


    // rules that need to be displayed to user
    if (required_subjects.indexOf("CHEM114") != -1) {
        document.getElementById("chem114-special").style.display = "block";
        if (prerequisites["l2-chemistry"] == 0) {
            // note: summer recommended
            document.getElementById("no-chemistry").style.display = "block";
        } else {
            document.getElementById("no-chemistry").style.display = "none";
        }
    } else {
        document.getElementById("chem114-special").style.display = "none";
        document.getElementById("no-chemistry").style.display = "none";
    }
    
    if (required_subjects.indexOf("CHEM111") != -1) {
        // check is CHEM111 is in both semesters
        if (semester_occurances["Semester 1"].indexOf("CHEM111") != -1) {
            if (semester_occurances["Semester 2"].indexOf("CHEM111") != -1) {
                document.getElementById("chem112-clash").style.display = "block";
            }
        }
    } else {
        document.getElementById("chem112-clash").style.display = "none";
    }

    // for each subject: build a div (new row) and attach columns
    for (var i in required_subjects) {

        // create new row
        var table_row = document.createElement("div");

        var subject = required_subjects[i];
        var selected = false;
        table_row.className = subject + " table-row";

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

        // imsert trashcan image to end of row
        if (common_subjects.indexOf(subject) == -1) {
            var img = document.createElement("IMG");
            img.src = "trashcan.png";
            img.id = "delete-" + subject;
            img.onclick = function(img) {
                removeSubject(img.target.id); };
            var img_div = document.createElement("div");
            img_div.className = "trashcan";
            img_div.appendChild(img);
            table_row.appendChild(img_div);
        }
        // add row to table
        subject_table.appendChild(table_row);

    }

    var num_electives = document.getElementsByClassName("elective").length;
    if (num_electives == 0) {
        document.getElementById("semester-elective").style.display = "none";
    }

    // count number of subjects in each semester and update the list of eng disciplines possible
    semesterCount();

}


// remove subject from table when trashcan icon clicked
function removeSubject(subject_id) {
    /* Input: id of subject that needs to be removed from the table
     * Output: none
     */
    var subject_row = document.getElementsByClassName(subject_id.slice(7) + " table-row")[0];
    subject_row.parentNode.removeChild(subject_row);
    semesterCount();
    updateEngList();
}


// build button element for table
function buildButton(table_row, subject, selected, column) {
    /* Input: new table row element, subject name, column number
     * Output: none
     */

    var cell = document.createElement("div");
    cell.id = "cell-" + subject + "-" + column.slice(1);
    cell.className = "cell";
    // create div
    var button = document.createElement("div");
    button.id = subject + "-" + column.slice(1);
    button.className = selected + " subject-button" + column;
    button.onclick = function() {
        subjectButtonClick(button);
        semesterCount();
        updateEngList();
    };

    if (selected == true) {
        button.value = subject;
        button.innerHTML = subject;
        button.id = subject + "-" + column.slice(1);
        button.draggable = true;
        button.setAttribute('ondragstart', 'drag(event)');
    } else {
        button.innerHTML = "Alternative Semester";
        button.setAttribute('ondrop', 'drop(event)');
        button.setAttribute('ondragover', 'allowDrop(event)');
    }

    // add the button to the cell
    cell.appendChild(button);
    // add the button to the table row
    table_row.appendChild(cell);

}

// stop default action when subject button clicked and dragged
function allowDrop(ev) {
    ev.preventDefault();
}


// saves data from div that is picked up
function drag(ev) {
    if (Object.keys(rules).indexOf(ev.target.id) != -1) { // ignore eng buttons
        return;
    }
    ev.dataTransfer.setData("text", ev.target.id);
}


// drop the selected subject into a different cell in the table
function drop(ev) {
    ev.preventDefault();
    if (Object.keys(rules).indexOf(ev.target.id) != -1) { // ignore eng buttons
        return;
    }
    var data = ev.dataTransfer.getData("text");

    // find the element that was moved
    var moved = document.getElementById(data);
    // find the element that needs to be swapped with the moved div on drop
    var swap_with = ev.target;

    // if the element is being placed in the wrong row, do nothing
    if (swap_with.id.indexOf(data.slice(0, 7)) == -1) {
        return;
    }

    swapDivs(moved, swap_with);
    checkSubjectPrerequisites(moved);
    semesterCount();
}


// swap two divs with each other
// used to move a subject to a different semester
function swapDivs(div_a, div_b) {
    /* Input: two divs that need to be swapped
     * Output: none
     */

    // get the parent div of the cell to be swapped
    var div_a_parent = div_a.parentNode;

    div_b.parentNode.replaceChild(div_a, div_b);
    div_a_parent.appendChild(div_b);

    //swap the coloumns in class and id
    var div_b_id = div_b.id;
    div_b.id = div_a.id;
    div_a.id = div_b_id;
    div_a.className = div_a.className.slice(0, -1) + div_a.id.slice(-1);
    div_b.className = div_b.className.slice(0, -1) + div_b.id.slice(-1);
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


// places input box for electives
function buildFreeSpace(column) {
    /* Input: column number
     * Output: label element
     */

    // add note under Plan Advice for picking elective subjects
    document.getElementById("semester-elective").style.display = "block";

    var input = document.createElement("input");
    input.type = "text";
    input.className = "elective" + column;
    input.value = "Elective";
    input.setAttribute('onFocus', 'onFocus(this)');
    input.setAttribute('onBlur', 'onBlur(this)');
    return input;
}


// clear the default text from the elective box when clicked
function onFocus(elective_box) {
    /* Input: elective input box that needs default text removed
     * Output: none
     */
    if (elective_box.value == "Elective") {
        elective_box.value = "";
    }
}


// put default text back in elective box
function onBlur(elective_box) {
    /* Input: elective input box that needs default text added
     * Output: none
     */
    if (elective_box.value == "") {
        elective_box.value = "Elective";
    }
}


// determine which eng types are possible based on subjects currently in table
function updateEngList() {
    /* Input: none
     * Output: none
     */

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

    var possible_eng = []; // element
    var possible_eng_names = []; // just the element's value

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

        var element = document.getElementById(selected_eng[i].innerText).closest("label");
        if (element.className == "selected-eng") {
            if (req_subjects.length == count) {
                possible_eng.push(selected_eng[i]);
                possible_eng_names.push(selected_eng[i].childNodes[0].id);
            }
        }
    }

    // change class for eng type if it is available depending on subject selection
    var eng_elements = document.getElementById("eng-options").childNodes;
    for (var i = 0; i < eng_elements.length; i++) {
        if (possible_eng_names.indexOf(eng_elements[i].childNodes[0].value) != -1) {
            eng_elements[i].className = "selected-eng";
        } else {
            eng_elements[i].className = "";
        }
    }

    //updateReqSubjectList(possible_eng_names);

}


// react to subject button click
function subjectButtonClick(subject) {
    /* Input: subject button object
     * Output: none
     */

    console.log(subject);

    // get class of subject that was clicked
    var current_class = subject.className;
    // last part of class is the column number
    var column = current_class.slice(-9);

    console.log(current_class);

    // if subject was unselected, we now want to select it
    if (current_class.indexOf("false") != -1) {
        // get siblings in div - i.e. objects in same row, change their class to false
        var sibling_elements = subject.parentNode.parentNode.children;
        for (var i = 0; i < sibling_elements.length; i++) { // every element except last (undefined)
            console.log(sibling_elements[i].id);
            if (sibling_elements[i].id.indexOf("cell") != -1) { // if it is a cell, i.e. has a subject button in it
                var sibling_button = sibling_elements[i].children[0]; // get the button element
                if (sibling_button != subject) { // if it is not subject that was clicked, change it's class
                    var sibling_button_column = sibling_button.className.slice(-9);
                    sibling_button.className = "false subject-button" + sibling_button_column;
                }
            }
        }
        // change clicked button's class to true
        subject.className = "true subject-button" + column;

        checkSubjectPrerequisites(subject);
    }
}
