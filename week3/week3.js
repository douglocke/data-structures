// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');
var content = fs.readFileSync('data/m07.html');

// load `content` into a cheerio object
var $ = cheerio.load(content);

//from Chrome inspect, the path to the address:
//html, body, center, table, tbody, tr, td, table, tbody, tr, td, div, table, tr, td

//so we need to go three tables deep then find the td, go past an h4, then text after 2 brs

var AddressArray = [];
//eq -1 means get the last table
var tableHtml = $('table').eq(-1).html();

//we will call a text cleanup function later, but let's read it in now
function cleanupString(text) {
text2 = text.trim();

// without modification, strings will look  like this:
//  '\n\t\t\t\t\t\t351 East 74th Street, 2nd Floor Front Room, \n\t\t\t\t\t\t',
//  '(Betw. 1st & 2nd Avenues) 10021\n\t\t\t\t\t\t',

// so remove
text2 = text2.replace(/\n/g, "");
text2 = text2.replace(/\t/g, "");
text2 = text2.replace(/E /g, "East ");
text2 = text2.replace(/E\. /g, "East ");
text2 = text2.replace(/St\./g, "Street");
text2 = text2.split(',')[0];
text2 = text2.split('-')[0];

if (text2 == 'Church of the Good Shepard') {
text2 = '543 Main Street'
}
return text2;
}

// let's begin looping here, we are going to loop through the TRs to get to the TDs that have address
//there are two TRs get the second of each 
$('tr', tableHtml).each(function(i, elem) {
//there are two TDs, and we need to get the first  of each 
//elem beceomes for every tr
var Address1 = $('td', elem).eq(0).contents().eq(6).text();
//var Address2 = $('td', elem).eq(0).contents().eq(8).text();

//node type text
// this.nodeType === 3;
//console
console.log("Event " + i);
console.log("Address1: " + cleanupString(Address1));
//console.log("Address2: " + cleanupString(Address2));

//skip the first blank
if (i > 0) {
AddressArray.push(cleanupString(Address1));
//AddressArray.push(cleanupString(Address2));
//addressOne += (Address1 + Address2 + '\n');
}
//file output

});

console.log("***Address Array Begin ****");
console.log(AddressArray);
console.log("***Address Array End  ****");


//write out all the data
const writeStream = fs.createWriteStream('data/address07.txt');
const pathName = writeStream.path;

AddressArray.forEach(value => writeStream.write(`${value}\n`));

// the finish event is emitted when all data has been flushed from the stream
writeStream.on('finish', () => {
   console.log(`wrote all the array data to file ${pathName}`);
});

// handle the errors on the write process
writeStream.on('error', (err) => {
    console.error(`There is an error writing the file ${pathName} => ${err}`)
});

// close the stream
writeStream.end();


//week3 ********* WEEK 3 *********************
var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');
var apiKey = process.env.Texas_APIKey;

var meetingsData = [];
var ResultArray = [];
var counter = 0;
// eachSeries in the async module iterates over an array and operates on each item in the array in series

// use slice to limit calls for testing
//async.eachSeries(AddressArray.slice(0,3), function(value, callback) {
async.eachSeries(AddressArray, function(value, callback) {
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';

    console.log('Calling: ' + apiRequest);
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            console.log(tamuGeo['FeatureMatchingResultType']);
            //neeed to eliminate some of the API response.... so parse the JSON further into another JSON
            var respAddress = tamuGeo.InputAddress.StreetAddress;
            var respCity = tamuGeo.InputAddress.City;
            var respSt = tamuGeo.InputAddress.St;
            var respLat = tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude;
            var respLong = tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude;
            counter++;
            console.log('Address: ' + respAddress);
            console.log('City: ' + respCity);
            console.log('State: ' + respSt);
            console.log('Latitude: ' + respLat);
            console.log('Longitude: ' + respLong);
            ResultArray.push({
            id 			: counter, 
            respAddress 	: respAddress,
            respCity 		: respCity,
            respSt 		: respSt,
            respLat 		: respLat,
            respLong 		: respLong
            });
            console.log("***Result Array inside  ****");
            console.log(ResultArray);
            //meetingsData.push(tamuGeo);
        }
    });
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/AA07address.json', JSON.stringify(ResultArray));
    //fs.writeFileSync('data/AA07address.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
});


