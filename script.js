var lines = [];

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
        lines.push(data);
    }
	console.log(lines);
	test = document.getElementById("test");
	test.innerHTML = lines[0][0];
}
