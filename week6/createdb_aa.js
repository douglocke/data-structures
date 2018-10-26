
const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'dlocke';
db_credentials.host = 'douginstance.cfbmsiuau7cc.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;


async function createTables(db_credentials) {
// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
//need a better way to do this.... 
const client2 = new Client(db_credentials);

/*meeting_id          : value.meeting_id,
              filename            : value.filename,
              origAddress         : value.origAddress,
              origZip	          : value.origZip,
              meetingTitle        : value.meetingTitle,
              addressNote         : value.addressNote,
              respAddress         : respAddress,
              respCity            : respCity,
              respSt              : respSt,
              respLat             : respLat,
              respLong            : respLong,
              event_id            : value.event_id,
              dayofWeek           : value.dayofWeek,
              fromTime            : value.fromTime,
              toTime              : value.toTime,
              specialTxt          : value.specialTxt*/

var qCreateMeeting = "CREATE TABLE meeting (meeting_id int, filename varchar(25), placeName varchar(100), wheelChair varchar(50), details varchar(400), origAddress varchar(100), origZip varchar(10), meetingTitle varchar(100), addressNote varchar(100), respAddress varchar(100), respCity varchar(50), respSt char(2), respLat numeric(10,7), respLong numeric(10,7), event_id int, dayofWeek varchar(50), fromTime varchar(100), toTime varchar(100), specialTxt varchar(100));";
//var qDropMeeting = "DROP TABLE meeting;";
console.log(qCreateMeeting);
client.connect();
client.query(qCreateMeeting, (err, res) => {
    console.log(qCreateMeeting);
    client.end()
    console.log(err, res);
    console.log("Complete function createTables");
});

//console.log(qCreateAddress);
//client2.connect();
//client2.query(qCreateAddress, (err, res) => {
//    console.log(qCreateAddress);
//    client2.end()
//    console.log(err, res);
//});
//    setTimeout(function () {
//    console.log('Create address timeout completed'); 
//}, 5000); 
//};
}

createTables(db_credentials);
    setTimeout(function () {
    console.log('Running a timeout for 1000'); 
    //loadData(db_credentials, addyArray);
}, 1000); 

