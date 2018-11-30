var request = require('request');
const { Client } = require('pg');

// PARTICLE PHOTON
var device_id = process.env.PHOTON_ID;
var access_token = process.env.PHOTON_TOKEN;
var particle_variable = 'analogvalue';
var device_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable + '?access_token=' + access_token;
// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'dlocke';
db_credentials.host = process.env.AWSRDS_EP;



db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var getAndWriteData = function() {
    console.log("device_url: " + device_url);    
    // Make request to the Particle API to get sensor values
   request(device_url, function(error, response, body) {
    
   //Store sensor value(s) in a variable
    
  /*
  database variables will be:
  id
  connected
  deviceid
  last_handshake_at
  result*/

    var respConnected = JSON.parse(body).coreInfo.connected;
    var respDeviceid = JSON.parse(body).coreInfo.deviceID;
    var respResult = JSON.parse(body).result;
    var respResult2 = parseFloat(respResult).toFixed(2);

    console.log("respConnected: " + respConnected);
    console.log("respDeviceid: " + respDeviceid);
    console.log("respResult: " + respResult);
    console.log("respResult2: " + respResult2);

    // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();
    
    // The ID is an auto-increment integer
    // The respResult is  truncated ... we don't need extreme precision

   // Construct a SQL statement to insert sensor values into a table
   var thisQuery = "INSERT INTO tempsensor VALUES (DEFAULT," + respConnected + ", '" + respDeviceid + "', current_timestamp, " + respResult2 + ");";
   console.log("Query: " + thisQuery); // for debugging
  
    //Connect to the AWS RDS Postgres database and insert a new row of sensor values
    client.query(thisQuery, (err, res) => {
    	console.log(err, res);
    	client.end();
    	});
    });
};
    
    // write a new row of sensor data every five minutes
    setInterval(getAndWriteData, 300000);
    //setInterval(getAndWriteData, 4000);
