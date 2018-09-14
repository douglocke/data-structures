console.log("Hello, world!")

//npm install request
//mkdir data

var request = require('request');
var fs = require('fs');
//var async = require('async');

var pages = ["https://parsons.nyc/aa/m01.html"
,"https://parsons.nyc/aa/m02.html"  
,"https://parsons.nyc/aa/m03.html"  
,"https://parsons.nyc/aa/m04.html"  
,"https://parsons.nyc/aa/m05.html"  
,"https://parsons.nyc/aa/m06.html"  
,"https://parsons.nyc/aa/m07.html"  
,"https://parsons.nyc/aa/m08.html"  
,"https://parsons.nyc/aa/m09.html"  
,"https://parsons.nyc/aa/m10.html"]

var i;
var filename= [];
for (i = 0; i < pages.length; i++) { 
    console.log(pages[i]);
    filename.push(pages[i].split("/").pop());
    console.log(filename[i]);
} 


function makerequest(pages, filename) {
        request(pages,
        function(error, response, body){
    	if (!error && response.statusCode == 200) {
        fs.writeFileSync('/Users/douglaslocke/Documents/parsons/data-structures/week1/data/' + filename, body);
    	}
    	else {console.log("Request failed!")}
})};


for (j = 0; j < pages.length ; j++)
    {
    makerequest(pages[j], filename[j]);
    console.log("Made request for: " + pages[j]);
    }

