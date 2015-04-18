var table = [];
var eng_types = [];
var courses = [];
var checked_eng_types = [];
var checked_courses = [];

//import rules from csv file
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "rules.csv",
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
    courses = table.slice(4,21);
    /*var course_rows = table.slice(4,21);
    for (var i in course_rows) {
        courses.push(course_rows[i][1])
    }*/

    //engTypeCBoxes(); //'eng_options'
    
    for (var i in eng_types) {
        generateCheckBoxes(eng_types[i], "eng_options", i);
    }
    courseCBoxes();
    
    
    /*
    console.log(table);
    test = document.getElementById("test");
    test.innerHTML = table[0][0];
    */
}

//generate checkbox for each type of engineering degree
function engTypeCBoxes() {

    for(var i in eng_types) {
        var name = eng_types[i];

        // create the necessary elements
        var label = document.createElement("label");
        var description = document.createTextNode(name);
        var checkbox = document.createElement("input");

        checkbox.type = "checkbox";    // make the element a checkbox
        checkbox.name = 1;      // give it a name we can check on the server side
        checkbox.value = name;         // make its value
        checkbox.id = i;

        label.appendChild(checkbox);   // add the box to the element
        label.appendChild(description);// add the description to the element

        // add the label element to your div
        document.getElementById('eng_options').appendChild(label);


        //records what checkboxes are selected
        $("[name=1]").change(function() { 
            if(this.checked) {
                if (checked_eng_types.indexOf(this.value) == -1) {
                    checked_eng_types.push(this.value);    
                }
            } else {
                var index = checked_eng_types.indexOf(this.value);
                if (index > -1) {
                    checked_eng_types.splice(index, 1);
                }
            }
        });
    }

}

//generate checkbox for each course
function courseCBoxes(){
    for(var i in courses) {
        var name = courses[i][1];

        // create the necessary elements
        var label = document.createElement("label");
        var description = document.createTextNode(name);
        var checkbox = document.createElement("input");

        checkbox.type = "checkbox";    // make the element a checkbox
        checkbox.name = 1;      // give it a name we can check on the server side
        checkbox.value = name;         // make its value
        checkbox.id = i;

        if (courses[i][3] == "All") {
            checkbox.checked = true;
        }


        label.appendChild(checkbox);   // add the box to the element
        label.appendChild(description);// add the description to the element

        // add the label element to your div
        document.getElementById('course_options').appendChild(label);
    }
}


function generateCheckBoxes(name, div_tag, count) {
    //for(var i in options) {
        //var name = options[i];

        // create the necessary elements
        var label = document.createElement("label");
        var description = document.createTextNode(name);
        var checkbox = document.createElement("input");

        checkbox.type = "checkbox";    // make the element a checkbox
        checkbox.name = 1;      // give it a name we can check on the server side
        checkbox.value = name;         // make its value
        checkbox.id = count;

        label.appendChild(checkbox);   // add the box to the element
        label.appendChild(description);// add the description to the element

        // add the label element to your div
        document.getElementById(div_tag).appendChild(label);

        if (div_tag == "eng_options") {
            //records what checkboxes are selected
            $("[name=1]").change(function() { 
                if(this.checked) {
                    if (checked_eng_types.indexOf(this.value) == -1) {
                        checked_eng_types.push(this.value);    
                    }
                } else {
                    var index = checked_eng_types.indexOf(this.value);
                    if (index > -1) {
                        checked_eng_types.splice(index, 1);
                    }
                }
            });
        } else {
            if (courses[i][3] == "All") {
            checkbox.checked = true;
            }
        }
    //}
}






















