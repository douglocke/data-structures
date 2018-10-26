
const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'dlocke';
db_credentials.host = 'douginstance.cfbmsiuau7cc.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

/**************/

//const cTable = require('console.table');

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to query meetings on Monday that start on or after 7:00pm: 
//var thisQuery = "SELECT mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";

//all fields:
//SELECT meeting_id, filename, placeName, wheelChair, details, origAddress, origZip, meetingTitle, addressNote, respAddress, respCity, respSt, respLat, respLong, event_id, dayofWeek, fromTime, toTime, specialTxt 


//var thisQuery = "SELECT meeting_id, filename, placeName, wheelChair, details, origAddress, origZip, meetingTitle, addressNote, respAddress, respCity, respSt, respLat, respLong, event_id, dayofWeek, fromTime, toTime, specialTxt from meeting where dayofWeek='Monday'";
//var thisQuery = "SELECT meeting_id, filename, placeName, wheelChair, details, origAddress, origZip, meetingTitle, addressNote, respAddress, respCity, respSt, respLat, respLong, event_id, dayofWeek, fromTime, toTime, specialTxt from meeting";
var thisQuery = "SELECT placeName, meetingTitle, respCity, respSt, respLat, respLong, specialTxt from meeting";

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        console.log(res.rows);
        client.end();
    }
});



