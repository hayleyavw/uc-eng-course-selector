var table = [];
var eng_types = [];
var courses = [];
var checked_eng_types = [];
var checked_courses = [];

// import rules from csv file on first load
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "rules2.csv",
        dataType: "text",
        success: function(data) { 
            processData(data); 
        }
    });
});


// put csv dat into lists - eng options and course options
function processData(allText) {
    
    var allTextLines = allText.split(/\r\n|\n/);
    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        table.push(data);
    }
    eng_types = table[3].slice(3);
    courses = table.slice(4);
    
    for (var i in eng_types) {
        generateCheckBoxes(eng_types[i], "eng_options", i);
    }


    for (var i in courses) {
        if (i <= 5) { // i+1 to give different ID's than eng_option checkboxes
           generateCheckBoxes(courses[i][1], "semester_one", parseInt(i)+9);
        } else if (i <= 13) {
            generateCheckBoxes(courses[i][1], "semester_two", parseInt(i)+9);
        } else {
            generateCheckBoxes(courses[i][1], "summer", parseInt(i)+9); 
        }
    }
    
    countCourses();
    
}


// create checkboxes for each option individually
function generateCheckBoxes(name, div_tag, count) {

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

    // add the label element to your div
    document.getElementById(div_tag).appendChild(label);

    if (div_tag == "eng_options") {
        watchEngCB();
    } else { //check the required courses
        if (courses[count-9][3] == "All") {
        checkbox.checked = true;
        checked_courses.push([name, checkbox.id]);
        }
    }



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
    console.log("here")

    for (var i in courses) {
        if (courses[i][parseInt(cbID)+3] == "Req" ) {
            document.getElementById(parseInt(i)+9).checked = true;
            checked_courses.push([courses[i][1], parseInt(i)+9]);            
        }
    }

    countCourses();

}


// uncheck courses when eng option unselected
function changeHighlightedCourses(cbID) {
    
    var index;
    for (var i in courses) {
        for (var j in checked_courses) {
            if (checked_courses[j][0] == courses[i][1]) {
                index = j
            }
        }
        //var index = checked_courses.indexOf(courses[i][1]);
        if (courses[i][parseInt(cbID.id)+3] == "Req") {
            checked_courses.splice(index, 1);
        }
    }
    
    var current_checkbox;
    var found;
    for (var box = 9; box < 26; box++) {
        current_checkbox = document.getElementById(box);
        found = false;
        for (var i in checked_courses) {
            if (checked_courses[i][0] == current_checkbox.value) {
                found = true;
            }
        }
        /*
        if (checked_courses.indexOf(current_checkbox.value) == -1) {
            current_checkbox.checked = false;
        }
        */
        if (found == false) {
            current_checkbox.checked = false;
        }

        countCourses();
    }

}



function countCourses() {

    var id_to_count = [];

    var semester_one_count = 0;
    var semester_two_count = 0;
    var summer_count = 0;

    for (var i in checked_courses) {
        if (id_to_count.indexOf(checked_courses[i][1]) == -1) {
            id_to_count.push(checked_courses[i][1]);
        }
    }

    for (var i in id_to_count) {
        if (id_to_count[i] <= 14) {
            console.log(checked_courses[i][1])
            semester_one_count += 1
        } else if (id_to_count[i] <= 22) {
            semester_two_count += 1
        } else {
            summer_count += 1
        }
    }

    console.log(checked_courses);

    document.getElementById('semester_one_total').innerHTML = "Courses: " + semester_one_count;
    document.getElementById('semester_two_total').innerHTML = "Courses: " + semester_two_count;
    document.getElementById('summer_total').innerHTML = "Courses: " + summer_count;

}




















