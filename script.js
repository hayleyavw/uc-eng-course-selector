var table = [];
var eng_types = [];
var courses = [];
var checked_eng_types = [];
var checked_courses = [];

//import rules from csv file on first load
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

    console.log(courses);

    for (var i in courses) {
        if (i <= 5) {
           generateCheckBoxes(courses[i][1], "semester_one", parseInt(i)+9); // i+1 to give different ID's than eng_option checkboxes
        } else if (i <= 13) {
            generateCheckBoxes(courses[i][1], "semester_two", parseInt(i)+9); // i+1 to give different ID's than eng_option checkboxes
        } else {
            generateCheckBoxes(courses[i][1], "summer", parseInt(i)+9); // i+1 to give different ID's than eng_option checkboxes
        }
    }
    
}


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
            }
        }
    //}
}

// watch the engineering checkboxes for change
function watchEngCB() {
    $("[name=1]").change(function() { 
        var index = checked_eng_types.indexOf(this.value);
        if(this.checked) {
            if (index == -1) {
                checked_eng_types.push(this.value);
                changeHighlightedCourses(this.id, true);
            }
        } else {
            if (index > -1) {
                checked_eng_types.splice(index, 1);
                changeHighlightedCourses(this.id, false);
            }
        }
        
    });
}

// highlight different courses based on eng options selected
function changeHighlightedCourses(cbID, added) {
    for (var i in courses) {
        if (courses[i][parseInt(cbID)+3] == "Req") {
            if (added == true) {
                document.getElementById(parseInt(i)+9).checked = true;
            } else {
                document.getElementById(parseInt(i)+9).checked = false;
            }
        }
    }
}





















