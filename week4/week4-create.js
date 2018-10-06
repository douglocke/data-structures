
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

var qCreateMeeting = "CREATE TABLE meeting (meeting_id int, meeting_name varchar(100), venue_id int);";
//var qDropMeeting = "DROP TABLE meeting;";
var qCreateAddress = "CREATE TABLE address (address_id int, streetname varchar(100),  city varchar(100), state char(2), zip char(5), cross_street varchar(100), clean_streetname varchar(100), clean_city varchar(100), clean_state char(2), clean_zip char(5), clean_lat numeric(10,7), clean_long numeric(10,7));";
//var qDropAddress = "DROP TABLE address;";
console.log(qCreateMeeting);
client.connect();
client.query(qCreateMeeting, (err, res) => {
    console.log(qCreateMeeting);
    client.end()
    console.log(err, res);
});

console.log(qCreateAddress);
client2.connect();
client2.query(qCreateAddress, (err, res) => {
    console.log(qCreateAddress);
    client2.end()
    console.log(err, res);
});
    setTimeout(function () {
    console.log('Create address timeout completed'); 
}, 5000); 
console.log("Complete function createTables");
};



createTables(db_credentials);
    setTimeout(function () {
    console.log('Running a timeout for 1000'); 
    //loadData(db_credentials, addyArray);
}, 1000); 

