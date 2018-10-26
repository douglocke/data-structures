// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');




var content10 = fs.readFileSync('data/m10.html');
var filename10 = "m10";
var content9 = fs.readFileSync('data/m09.html');
var filename9 = "m09";
var content8 = fs.readFileSync('data/m08.html');
var filename8 = "m08";
var content7 = fs.readFileSync('data/m07.html');
var filename7 = "m07";
var content6 = fs.readFileSync('data/m06.html');
var filename6 = "m06";
var content5 = fs.readFileSync('data/m05.html');
var filename5 = "m05";
var content4 = fs.readFileSync('data/m04.html');
var filename4 = "m04";
var content3 = fs.readFileSync('data/m03.html');
var filename3 = "m03";
var content2 = fs.readFileSync('data/m02.html');
var filename2 = "m02";
var content1 = fs.readFileSync('data/m01.html');
var filename1 = "m01";

// load `content` into a cheerio object

//from Chrome inspect, the path to the address:
//html, body, center, table, tbody, tr, td, table, tbody, tr, td, div, table, tr, td
//so we need to go three tables deep then find the td, go past an h4, then text after 2 brs
//var AddressArray = [];
//var resultArray = [];
var counter = 0;
var counter_meeting = -1;
var meetingArray = [];

function doEverything(content, filename) {


var $ = cheerio.load(content);
var eventArray = [];
var detailArray = [];
//eq -1 means get the last table
var tableHtml = $('table').eq(-1).html();
function parseMeeting(strToParse, strStart, strFinish)
{
var str = strToParse.match(strStart + '(.*?)' + strFinish);
if (str != null) {
//console.log('Parsed Item: ' + str[1]);
return(str[1]);
}
else
console.log('The string result returned null.');
return("nothing");
}


function cleanupString(text) {
  text2 = text.trim();
  text2 = text2.replace(/\n/g, "");
  text2 = text2.replace(/\t/g, "");
return text2.trim();
}
//we will call a text cleanup function later, but let's read it in now
function cleanupAddress(text) {
  text2 = text.trim();
  // without modification, strings will look  like this:
  //  '\n\t\t\t\t\t\t351 East 74th Street, 2nd Floor Front Room, \n\t\t\t\t\t\t',
  //  '(Betw. 1st & 2nd Avenues) 10021\n\t\t\t\t\t\t',
  // so remove
  console.log("Calling cleanup with: " + text2 );
  text2 = text2.replace(/\n/g, "");
  text2 = text2.replace(/\t/g, "");
  text2 = text2.replace(/E /g, "East ");
  text2 = text2.replace(/W /g, "West ");
  text2 = text2.replace(/E\. /g, "East ");
  text2 = text2.replace(/W\. /g, "East ");
  text2 = text2.replace(/Rm 306/g, "");
  text2 = text2.replace(/502 West165th Street/g, "502 West 165th Street");
  text2 = text2.replace('\. Meeting in the gym\.',"");
  text2 = text2.replace('@ Fort Washington Avenue',"");

  if (text.trim() == '80 St. Mark\'s Place, 2nd Floor,'){
   text2 = text2;
     }
   else { 
  text2 = text2.replace(/St\./g, "Street");
       }

  text2 = text2.replace(/\(Basement\)/g, "");
  text2 = text2.replace(/\(Red Door/g, "");
  text2 = text2.replace(/Strert/g, "Street");
  text2 = text2.split(',')[0];

  if (text.trim() == '206-208 East 11th Street,'){
     text2 = text2;
     }
   else if (text.trim() == '58-66 West 135th Street,') {
     }
   else {
    text2 = text2.split('-')[0];
     }
  if (text2 == 'Church of the Good Shepard') {
  text2 = '543 Main Street'
      }
  if (text.trim() == '189th Street & Bennett Avenue, Kitchen,') {
     text2 = '178 Bennett Avenue'
     //second floor
     }
  if (text.trim()  == '502 West165th Street, Basement,') {
     text2 = '502 West 165th Street'
     //basement
     }
return text2.trim();
}

var newrec = 0;

// let's begin looping here, we are going to loop through the TRs to get to the TDs that have address
//there are two TRs get the second of each 
$('tr', tableHtml).each(function(i, elem) {
	//there are two TDs, and we need to get the first  of each 
	//elem beceomes for every tr
	var AddContents = $('td', elem).eq(0).contents();


        //get the address components

	var Address1 = $('td', elem).eq(0).contents().eq(6).text();
	var PlaceName = $('h4', elem).text().trim();
        console.log('Placename = ' + PlaceName);

	var DetailsBox = $('div', elem).text().trim();
        console.log('DetailsBox = ' + DetailsBox);

	var Wheel = $('span', elem).text().trim();
        console.log('Wheel = ' + Wheel);

	var Address1 = $('td', elem).eq(0).contents().eq(6).text();
	var meetingTitle = $('td', elem).eq(0).contents().eq(4).text();
	var AddressNote = $('td', elem).eq(0).contents().eq(8).text();
        var AddressNote2 = "";

        console.log('AddressNote Length: ' + AddressNote.trim.length);
        console.log ("AddressNote: " + AddressNote.trim());
	if (AddressNote.trim().length > 8)
           {
	   var last8 = AddressNote.trim().substr(AddressNote.trim().length - 8);
	   if (last8.substr(0,2)=='NY')
              {
              AddressNote2 = AddressNote.trim().substr(0,AddressNote.trim().length-8);
              }
           }

        console.log ("AddressNote2: " + AddressNote.trim());

        var Zip = "Unknown";
	if (AddressNote.trim().length > 5)
           {
            if (!isNaN(AddressNote.substr(AddressNote.trim().length - 5))) {
	    Zip = AddressNote.substr(AddressNote.trim().length - 5);}
           }
        console.log ("Zip: " + Zip);
	//console.log("meetingTitle " + meetingTitle);
	//console.log("Event " + i);
	//console.log("Address1: " + cleanupAddress(Address1));
        counter_meeting++;
        var fromTime = "";
        var toTime = "";
        var dayofWeek = "";
        var specialTxt = "";
        var meetingType = "";
        var lastloop = "";

	//getTheMeetings
	var text1 = $('td', elem).eq(1).html();
	//var text2 = text1.split('<br>');
	//var text1 = $('td', elem).eq(1).contents().htext();

	console.log("text1: " + text1);
	if (text1) //if not null
	 {
         //this line is <br> followed by new line, spaces, tab another <br>
  	 eventArray = text1.split('<br>\n                    	<br>');
         //console.log("EventArray Length" + eventArray.length);
         //loop through the eventarray.  some will be blank.
           for (var n=0;n<eventArray.length-1;n++)
           {
           console.log("Event " + n + ": " + eventArray[n].trim());
           var srctext = eventArray[n].trim();

  	   detailArray = srctext.split('</b>');
           console.log("DetailArray Length: " + detailArray.length);

           for (var d=0;d<detailArray.length;d++)
               {
               console.log("     Detail: " + d + ": " + detailArray[d]);
               /*
		DetailArray Length: 5
     		Detail: 0: <b>Tuesdays From
     		Detail: 1:   10:00 AM <b>to
     		Detail: 2:  11:00 AM <br><b>Meeting Type
     		Detail: 3:  B = Beginners meeting <br><b>Special Interest
     		Detail: 4:  Living Sober
               */
               //var parsetxt = parseMeeting(detailArray[d], "<b>", " ");
               //console.log('Parsetxt: ' + parsetxt);
               //console.log("Parsed" + n + ": " + newtext);
               if (d==3)
               {
               //if Meeting
  	       meetingType = detailArray[d].split('=')[0].trim();
               console.log('		meetingType: ' + meetingType);
               }
              else if (d==4)
               {
	       //Special
  	       specialTxt = detailArray[d].trim();
               console.log('		specialTxt: ' + specialTxt);
	       }
             else if (d==1)
               {
               //fromTime
  	       fromTime = detailArray[d].split('<b>')[0].trim();
               console.log('		fromTime: ' + fromTime);
	       }
             else if (d==2)
               {
               //toTime
  	       toTime = detailArray[d].split('<br>')[0].trim();
               console.log('		toTime: ' + toTime);
	       }
             else if (d==0)
               {
		//Dayofweek
  	       dayofWeek = parseMeeting(detailArray[d].trim(), "<b>", "From");
               console.log('		dayofWeek: ' + dayofWeek);
               counter++;
	       }
             else 
              {
              }
 
             }//end for
              meetingArray.push({
              meeting_id          : counter_meeting,
              filename            : filename,
              placeName	          : PlaceName,
              wheelChair	  : Wheel,
              details		  : DetailsBox,
              origAddress         : cleanupAddress(Address1),
              meetingTitle        : cleanupString(meetingTitle.split('-')[0]),
              addressNote         : cleanupString(AddressNote2),
              zip 	          : cleanupString(Zip),
              //respAddress         : "blank",
              //respCity            : "New York",
              //respSt              : "NY",
              //respLat             : "999",
              //respLong            : "999",
              event_id            : counter,
              dayofWeek           : dayofWeek.trim(),
              fromTime            : fromTime,
              toTime 		  : toTime,
              specialTxt          : specialTxt
              });
           } //end for
         } //endif  this is the end of the events


	//address
	// eq 1 = location place name
	// eq 4 = title of the meeting
	// eq 6  address
	//eq 8  second part of address 
	/*
	text4: GRUPO LA FLAMA PANAMERICANA - Grupo La Flama Panamericana
	text6:
                                                35 Thayer Street, Basement,

	text8: (@ 200th Street, behind Dyckman Avenue ) NY 10040
	*/

        //firstAddress is for Geocoding
        //secondAddress is more like a note

	//console.log("Contents: " + AddContents);
	//console.log("************  /end AddContents");
	//console.log("Address2: " + cleanupString(Address2));
	//skip the first blank

});

}


doEverything(content10,filename10);
doEverything(content9,filename9);
doEverything(content8,filename8);
doEverything(content7,filename7);
doEverything(content6,filename6);
doEverything(content5,filename5);
doEverything(content4,filename4);
doEverything(content3,filename3);
doEverything(content2,filename2);
doEverything(content1,filename1);

console.log("***meeting Array Begin ****");
console.log(meetingArray);
console.log("***meeting Array End  ****");


var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');
var apiKey = process.env.Texas_APIKey;
//var meetingsData = [];
var ResultArray = [];
//var counter = 0;
//async.eachSeries(meetingArray.slice(0,5), function(value, callback) {
//async.eachSeries(meetingArray.slice(0,5), function(value, callback) {
async.eachSeries(meetingArray, function(value, callback) {
//async.eachSeries(AddressArray, function(value, callback) {
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    //apiRequest += 'streetAddress=' + meetingArray.origAddress.value.split(' ').join('%20');
    //console.log(meetingArray);
    apiRequest += 'streetAddress=' + value.origAddress.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';

    console.log('Calling: ' + apiRequest);
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            console.log(tamuGeo['*****result tamuGeo*****']);
            console.log(body);
            //neeed to eliminate some of the API response.... so parse the JSON further into another JSON
            var respAddress2 = tamuGeo.InputAddress.StreetAddress.trim();
            var respAddress = respAddress2.replace("New York NY", "");
            var respCity = tamuGeo.InputAddress.City;
            //var respSt = tamuGeo.InputAddress.St;
            var respSt = "NY";
            var respLat = tamuGeo.OutputGeocodes[0].OutputGeocode.Latitude;
            var respLong = tamuGeo.OutputGeocodes[0].OutputGeocode.Longitude;
            counter++;
            console.log('Address: ' + respAddress);
            console.log('City: ' + respCity);
            console.log('State: ' + respSt);
            console.log('Latitude: ' + respLat);
            console.log('Longitude: ' + respLong);
            ResultArray.push({
              meeting_id          : value.meeting_id,
              filename            : value.filename,
              origAddress         : value.origAddress,
              origZip         	  : value.zip,
              meetingTitle        : value.meetingTitle,
              placeName	          : value.placeName,
              wheelChair	  : value.wheelChair,
              details		  : value.details,
              addressNote         : value.addressNote,
              respAddress         : respAddress,
              respCity            : respCity,
              respSt              : respSt,
              respLat             : respLat,
              respLong            : respLong,
              event_id            : value.event_id,
              dayofWeek           : value.dayofWeek,
              fromTime            : value.fromTime,
              toTime 		  : value.toTime,
              specialTxt          : value.specialTxt
            });
            console.log("***Result Array inside  ****");
            console.log(ResultArray);
            //meetingsData.push(tamuGeo);
        }
    });
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/readyfordb.json', JSON.stringify(ResultArray));
    //fs.writeFileSync('data/AA07address.json', JSON.stringify(meetingsData));
    console.log('*************');
});
