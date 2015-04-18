var table = [];
var checked;

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
    engTypeCBoxes();
    /*
    console.log(table);
    test = document.getElementById("test");
    test.innerHTML = table[0][0];
    */
}

function engTypeCBoxes() {

    var eng_types = table[3].slice(3);
    for(var i in eng_types) {
        var name = eng_types[i];

        // create the necessary elements
        var label = document.createElement("label");
        var description = document.createTextNode(name);
        var checkbox = document.createElement("input");

        checkbox.type = "checkbox";    // make the element a checkbox
        checkbox.name = 1;      // give it a name we can check on the server side
        checkbox.value = name;         // make its value
        checkbox.id = 1;

        console.log(checkbox);

        label.appendChild(checkbox);   // add the box to the element
        label.appendChild(description);// add the description to the element

        // add the label element to your div
        document.getElementById('eng_options').appendChild(label);

        $("[name=1]").change(function() { 
            if(this.checked) {
                console.log(this.value);
            } else {
                console.log("not here");
            }
        });
        /*
        $('#1').on('change', function() {
            if(this.checked) {
                console.log("checked");
                checked = this;
            } else {
                console.log("not checked");
            }
            console.log(checked);
        });
        console.log(checked);
        */
    }

    /*
    var cbh = document.getElementById('cb');
    var val = '1';
    var cap = 'Jan';

    var cb = document.createElement('input');
    cb.type = 'checkbox';
    cbh.appendChild(cb);
    cb.name = val;
    cb.value = cap;
    cb.appendChild(document.createTextNode(cap));
    */

    /*
    var pair = ["answer1"];

    // create the necessary elements
    var label= document.createElement("label");
    var description = document.createTextNode(pair);
    var checkbox = document.createElement("input");

    checkbox.type = "checkbox";    // make the element a checkbox
    checkbox.name = "slct[]";      // give it a name we can check on the server side
    checkbox.value = pair;         // make its value "pair"

    label.appendChild(checkbox);   // add the box to the element
    label.appendChild(description);// add the description to the element

    // add the label element to your div
    document.getElementById('some_div').appendChild(label);

    // clear the former content of a given <div id="some_div"></div>
    document.getElementById('some_div').innerHTML = '';
    */

    /*
    var eng_types = table[3].slice(3);
    $("div").append("<ul></ul>");
    for(var i in eng_types) {
        var li = "<li>";
        $("ul").append(li.concat(eng_types[i]))
    }
    */

}


function displayPapers(i){
    console.log(i);
}






















