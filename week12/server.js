
//Doug Locke Assignment 10

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
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 

//this query for the temperature sensor summarizes by room and the
//day and the hour, taking an average the readings during the hour.

//eventually the logic for room can be changed from this hardcoding
//either embed the field and flash to the device,
//or create a ruleset on when the location changed

    var q = `select 'office' as location, to_char(last_handshake_at at time zone 'utc' at time zone 'est', 'YYYY-MM-DD') as date, 
to_char(last_handshake_at at time zone 'utc' at time zone 'est', 'HH24') as hour,
avg(result)*9/5+32 as temp_f from tempsensor group by 2,3 order by 2 desc,3 desc;`;

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

// respond to requests for /aameetings
// this is hardcoded to a default view

// TODO
// pass parameters in to change the day of week and AM/PM
// pass parameter to select within walking distance


app.get('/aameetings', function(req, res) {
    
    console.log("calling aameetings...PreClient");
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    console.log("PostClient");
    

   var thisQuery = `SELECT respaddress, placename as location, details, wheelchair, resplat, resplong, json_agg(json_build_object('title', meetingtitle, 'special', specialtxt, 'day', dayofweek, 'time', fromtime)) as meetings
                 FROM meeting
                 WHERE dayofweek = 'Tuesdays' and fromtime like '%PM'
                 GROUP BY respaddress, placename, details, wheelchair, resplat, resplong
                 ;`;



    console.log("Query: " + thisQuery);
    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    // DynamoDB (NoSQL) query
    //begin
var params = {
    TableName : "deardiary",
    KeyConditionExpression: "#p = :purpose AND #ident = :minid", // the query expression
     //the equal should be replaced with GE  (greater than or equal)

    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#p" : "purpose",
        "#ident" : "id"
    },
    ExpressionAttributeValues: { // the query values
        ":purpose": {S: "School"},
        ":minid": {N: "3"}
    }
  };

//end

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
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
