//Final Projects
//Doug Locke
//AA, Sensor, and Dear Diary
//Node/Express Server Code
//December 15, 2018


var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'dlocke';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

// respond to requests for /sensor
//each app has a section for handling request
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 

//this query for the temperature sensor summarizes by room and the
//day and the hour, taking an average the readings during the hour.

//eventually the logic for room can be changed from this hardcoding
//either embed the field and flash to the device,
//or create a ruleset on when the location changed

    var q = `select 
    case when id <=5873 then 'Office'
     when id >=5874 and id <=6923 then 'Garage'
     when id >=6924 then 'Kitchen' end as room, 
     to_char(last_handshake_at at time zone 'utc' at time zone 'est', 'HH24') as hour,
     (avg(result)*9/5+32)::numeric(3,1)   as temp_f from tempsensor where id>=5874 and id<=6923 group by 1,2 order by 1 asc,2 asc;`;

    console.log("Query: " + q);
    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
        }
    });
});


var s1x = `<!DOCTYPE html>
<meta charset="utf-8">
<!-- Adapted from: http://bl.ocks.org/Caged/6476579 -->
<style>
body {
  font: 10px sans-serif;
}
.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}
.bar {
  fill: grey;
}
.bar:hover {
  fill: orange ;
}
.x.axis path {
  display: none;
}
.d3-tip {
  line-height: 1;
  font-weight: bold;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 2px;
}
/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  position: absolute;
  text-align: center;
}
/* Style northward tooltips differently */
.d3-tip.n:after {
  margin: -1px 0 0 0;
  top: 100%;
  left: 0;
}
</style>
<body>
Doug Locke / Data Structures
Temperature Sensor Data.
<a href="/ss?filter=garage">Garage</a> <a href="/ss?filter=office">Office</a> <a href="/ss?filter=kitchen">Kitchen</a>
<br>
<br>
<h2>Average Hourly Temperatures</h2><div id="main"></div>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<script>
var data = `;



var s2x = `; 
	var margin = {top: 40, right: 20, bottom: 30, left: 40},
    	width = 960 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom;
	//var formatPercent = d3.format(".0%");
	var x = d3.scale.ordinal()
    		.rangeRoundBands([0, width], .1);
	var y = d3.scale.linear()
    	.range([height, 0]);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    //.tickFormat(formatPercent);
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    //return "<strong>Degrees</strong> <span style='color:red'>" + formatPercent(d.num_obs) + "</span>";
    return "<strong>Degrees</strong> <span style='color:red'>" + d.temp_f + "</span>";
     })
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.call(tip);
  x.domain(data.map(function(d) { return d.hour; }));
  y.domain([0, d3.max(data, function(d) { return d.temp_f; })]);
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      //.attr("dy", "-.71em")
      .attr("dy", "-3.00em")
      .style("text-anchor", "end")
      .text("Degrees Fahrenheit");
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.hour); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.temp_f); })
      .attr("height", function(d) { return height - y(d.temp_f); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
</script>
<script>
   //This script just places the room name... grabs from the result set of the query
   // assumes that they are all the same room
   var ssHTMLmain = "<h2>" + data[0].room +"</h2>";
   var room = document.createElement('div');
   room.className = 'room';
   room.innerHTML = ssHTMLmain;
   document.getElementById('main').appendChild(room); 
</script>
</script>

`;


//sensor application
app.get('/ss', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    var filt = req.param('filter');      


    var qfilter = "";
//filter to retrieve the right records for the room
    if (filt=="garage")
       {
       qfilter = "id>=5874 and id<=6923";
       }
    else if (filt=="office")
       {
       qfilter = "id <= 5873";
       }
    else if (filt=="kitchen")
       {
       qfilter = "id >= 6924";
       }
    else
       {
      // default garage
       qfilter = "id >= 6924";
       }

//TECHDEBT
//As I moved the sensor around, I noted the ID change in the records being recorded.
//This ID table could go into a separate table
//OR this sensor itself could be flashed with the room name every time the room changes.  However, this is inconvienient.

    var q = `select 
    case when id <=5873 then 'Office'
     when id >=5874 and id <=6923 then 'Garage'
     when id >=6924 then 'Kitchen' end as room, 
     to_char(last_handshake_at at time zone 'utc' at time zone 'est', 'HH24') as hour,
     (avg(result)*9/5+32)::numeric(3,1) as temp_f from tempsensor where ` + qfilter + ` group by 1,2 order by 1 asc,2 asc;`;

    console.log("Sensor Query: " + filt + " : " + q);

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            var resp = s1x + JSON.stringify(qres.rows) + s2x; 
            res.send(resp);
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
});

// respond to requests for /aameetings

//SUCCESSES
//Defaults to current day of week on entry, by passing day=Today
//Day of week selector works
//Details, Wheelechair

//TECHDEBT
//I did not execute a the ZipCode search bar
//Did not focus on current location.
//There are a few locations without location names, currently handled with a graceful error. 
//However, I would need to check the parsing again for all individual errors
// pass parameter to select within walking distance


// create templates
// This leaflet map was originally from an example on the NYC.GOV website
// Day of week selector is a simple URL parameter
var hx = `<!doctype html>
<html lang="en">
<head>
<title>AA New York City</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
   integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>
 <!-- Make sure you put this AFTER Leaflet's CSS -->
 <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
   integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
   crossorigin=""></script>
  <style>
    #mapid { height: 680px; }
  </style>
</head>

<body>
Locke/Final Project.  AA Meetings in NYC.  
<a href = "/aameetings?day=Mondays">Mon </a> <a href = "/aameetings?day=Tuesdays">Tue </a> <a href = "/aameetings?day=Wednesdays">Wed </a> <a href = "/aameetings?day=Thursdays">Thu </a> <a href = "/aameetings?day=Fridays">Fri </a> <a href = "/aameetings?day=Saturdays">Sat </a> <a href = "/aameetings?day=Sundays">Sun </a>
 <div id="mapid">
</div>
<script>
  var data = 
  `;
  

var jx = `;

var map = L.map('mapid');
map.setView([40.774862, -73.969288], 12);

var baseLayer = L.tileLayer('https://maps{s}.nyc.gov/tms/1.0.0/carto/basemap/{z}/{x}/{y}.jpg', {
  minNativeZoom: 8,
  maxNativeZoom: 19,
  subdomains: '1234',
  tms: true,
  bounds: L.latLngBounds([39.3682, -75.9374], [42.0329, -71.7187])
});

map.addLayer(baseLayer);

var labelLayer = L.tileLayer('https://maps{s}.nyc.gov/tms/1.0.0/carto/label/{z}/{x}/{y}.png8', {
  minNativeZoom: 8,
  maxNativeZoom: 19,
  subdomains: '1234',
  tms: true,
  bounds: L.latLngBounds([40.0341, -74.2727], [41.2919, -71.9101])
});

map.addLayer(labelLayer);

//For reference, this is an example of the JSON passed
/*
{
"details": "T Last Tuesday, Thu.=Topic",
"location": "St. George's Church",
"meetings":
[
{
"day": "Tuesdays",
"special": "",
"time": "6:00 PM",
"title": "POTPOURRI"
}
],
"respaddress": "209 E 16TH ST ",
"resplat": "40.7345135",
"resplong": "-73.9854432",
"wheelchair": ""
}
*/

//loop through the meetings

    for (var i=0; i<data.length; i++) {

//graceful handle the missing locations

        var tlocation = data[i].location;
        var locderror = "";
        if (tlocation == "")
           {
           locderror = "The location name could not be found."
           }

        tlocation = tlocation + locderror;

        var locationHTML = '<h2>' + tlocation + '</h2>' +
            '<h3>' + data[i].respaddress + '</h3><br>' + 
            data[i].details + '<br>' +
            data[i].wheelchair  

        var meetingsHTML = "";

//loop through the meetings
        for (var m=0; m < data[i].meetings.length; m++)
            {
            var title = data[i].meetings[m].title;       
            var time = data[i].meetings[m].time;       
            var day = data[i].meetings[m].day;       
            meetingsHTML = meetingsHTML + day + ' ' + time + ' ' + title + '<br>'; 
	    }
     
         var innerHTML = '<table><tr><td>' + locationHTML + '</td></tr><tr><td>' +  meetingsHTML + '</td></tr></table>'

//place the popup on the map
        L.marker( [data[i].resplat, data[i].resplong] ).bindPopup(innerHTML,minWidth=200).addTo(map);
    }
    </script>
    </body>
    </html>`;


app.get('/aameetings', function(req, res) {
    var reqday = req.param('day');      
    console.log("calling aameetings...PreClient");
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    console.log("PostClient");
    console.log("day=" +reqday);
    
//need to translate Today to a day of week that can be inserted into the query

    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sundays";
    weekday[1] = "Mondays";
    weekday[2] = "Tuesdays";
    weekday[3] = "Wednesdays";
    weekday[4] = "Thursdays";
    weekday[5] = "Fridays";
    weekday[6] = "Saturdays";
    var n = "";


//Default is today, otherwise use the day of week passed in from the URL

    if (reqday=="Today")
       {
       n = weekday[d.getDay()];
       }
       else 
       {
       n = reqday;
       }

//the query is pretty straightforward.   all of the place attributes need to be added to the GROUP BY

   var thisQuery = `SELECT respaddress, placename as location, details, wheelchair, resplat, resplong, json_agg(json_build_object('title', meetingtitle, 'special', specialtxt, 'day', dayofweek, 'time', fromtime)) as meetings
                 FROM meeting
                 WHERE dayofweek ='` + n + `' GROUP BY respaddress, placename, details, wheelchair, resplat, resplong
                 ;`;

    console.log("Query: " + thisQuery);

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        
        else {
            var resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

// DEAR DIARY **********************************************************************
//Fields to work with in the diary:
/*{
author
"date":
"device":
"experience":
"format":
"id":
"purpose":
"title":
"value":
*/
//begin the HTML document
var dx1 = `<!doctype html>
<html lang="en">
<head>
<title>Dear Diary</title>
<head>
</head>
<body>
Doug Locke / Dear Diary <br>

All entries are scored 1 (least valuable) to 5 (most valuable). <br>
<br>
<a href="/deardiary?filter=off">Work (1-5)</a>
<a href="/deardiary?filter=on">School(4-5 only)</a>

<div id="main">
</div>
<script>
  var data = 
  `;
//we end the first document beginning with the JSON data

//we willinsert the JSON here

// we then begin the second part of the HTML, which will build the table

var dx2 = `;
var ddHTMLmain="";
    //loop through all diary entries
    //this will reverse order and put the latest at the top.
    //TECHDEBT a better solution is to use the data field to reverse order
    //Performance:  if we had a huge amount of entries, we may have to find another solution     
    for (var d=data.length-1; d>=0; d--) {
    //we build the table. This is old style HTML but it works for getting some output for now
    var p1 =  '<table border=1 width=900px> <tr> <td>Score=<h1>' + data[d].value.N + '</h1></td>' ; 
    var p2 =  '<td><h3>' + data[d].title.S + '</h3></td>' ; 
    var p3 =  '<td> by ' + data[d].author.S + '</td>' ; 
    var p4 =  '<td> for ' + data[d].purpose.S + '</td></tr>' ; 
    var p5 =  '<tr><td colspan=4> Summary: ' + data[d].experience.S + '</td></tr>' ; 
    var p6 =  '<tr><td>' + data[d].date.S + '</td>' ; 
    var p7 =  '<td>' + data[d].device.S + '</td>' ; 
    var p8 =  '<td>' + data[d].format.S + '</td></tr> <br><br>' ; 

    ddHTMLmain = ddHTMLmain + p1 + p2 + p3 + p4 + p5 + p6 + p7 +p8 ; 
     };
    ddHTMLmain = ddHTMLmain + '</table>';
   //we create a new div.  and append the div to the existing main one
  
   var entry = document.createElement('div');
   entry.className = 'entry';
   entry.innerHTML = ddHTMLmain;
   document.getElementById('main').appendChild(entry); 
</script>
</body>
</html>`;


// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
   
    var filt = req.param('filter');      



    var today = new Date();
    var strtoday = today.toISOString().substring(0, 10); 

    var nummonths = 2;
    var valuetest = 3;
    var purposetest = 3;
    if (filt == "off") 
       {
        //30 years
       nummonths = 12*30;
        //all ratings
       valuetest = 0;
       } 

    var me = new Date();
    me.setMonth(me.getMonth() - nummonths);
    var me2str = me.toISOString().substring(0, 10); 



//School entry
//We basically build the two queries and then choose which one we want by the filter.
//TECHDEBT its slightly wasteful to build two queries. could do more to construt a single one more dynamically
var params = {
    TableName : "deardiary",
    //KeyConditionExpression: "#p = :purpose AND #ident = :minid", // the query expression
    KeyConditionExpression: "#p = :purpose AND #d between :dval1 and :dval2", // the query expression
    //KeyConditionExpression: "#d between :dval1 and :dval2", // the query expression
    FilterExpression: "#v > :value",
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#p" : "purpose",
        "#v" : "value",
        "#d" : "date"
    },
    ExpressionAttributeValues: { // the query values
        ":purpose": {S: "School"},
        ":value": {N: String(valuetest)},
        ":dval1": {S: me2str},
        ":dval2": {S: strtoday}
    }
  };
//end

var paramsOff = {
    TableName : "deardiary",
    //KeyConditionExpression: "#p = :purpose AND #ident = :minid", // the query expression
    KeyConditionExpression: "#p = :purpose AND #d between :dval1 and :dval2", // the query expression
    //KeyConditionExpression: "#d between :dval1 and :dval2", // the query expression
    FilterExpression: "#v > :value",
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#p" : "purpose",
        "#v" : "value",
        "#d" : "date"
    },
    ExpressionAttributeValues: { // the query values
        ":purpose": {S: "Work"},
        ":value": {N: String(valuetest)},
        ":dval1": {S: me2str},
        ":dval2": {S: strtoday}
    }
  };
//end

     //if filter is Off , which means Work entries, use the second query
     if (filt == "off")
        {
        params = paramsOff;
        }

     //we're using params here no matter what.  so if not "Off" use the original
    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            //took a while to realize to use Items in next line 
            console.log('Dear Diary Data: ' + JSON.stringify(data.Items));
            var resp = dx1 + JSON.stringify(data.Items) + dx2;
            res.send(resp);
            console.log('3) responded to request for dear diary data');
        }
    });

});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
//app.listen(8080, function() {
app.listen(8080, function() {
    console.log('Server listening on 8080...');
});
