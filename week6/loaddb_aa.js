
const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'dlocke';
db_credentials.host = 'douginstance.cfbmsiuau7cc.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;


/*meeting_id          : value.meeting_id,
 20               filename            : value.filename,
 21               origAddress         : value.origAddress,
 22               origZip             : value.origZip,
 23               meetingTitle        : value.meetingTitle,
 24               addressNote         : value.addressNote,
 25               respAddress         : respAddress,
 26               respCity            : respCity,
 27               respSt              : respSt,
 28               respLat             : respLat,
 29               respLong            : respLong,
 30               event_id            : value.event_id,
 31               dayofWeek           : value.dayofWeek,
 32               fromTime            : value.fromTime,
 33               toTime              : value.toTime,
 34               specialTxt          : value.specialTxt*/


function filetodb(db_credentials, meetingTable) {
  console.log("Calling filetodb");
  //console.log("meetingTable" + meetingTable);
  var blank = 'na';
  var Vasync = require('async');
  Vasync.eachSeries(meetingTable, function(row,callback) {

    //,E'` + row.placeName.replace("'","''") + `'

var qInsertAddress = `
  INSERT INTO meeting VALUES
  ( 
  ` + row.meeting_id + `
    ,E'` + row.filename + `'
    ,E'` + row.placeName.replace(/\'/g,"''") + `'
    ,E'` + row.wheelChair + `'
    ,E'` + row.details.replace(/\'/g,"''") + `'
    ,E'` + row.origAddress + `'
   ,E'` + row.origZip + `'
   ,E'` + row.meetingTitle.replace(/\'/g,"''") + `'
     ,E'` + row.addressNote.replace(/\'/g,"''") + `'
    ,E'` + row.respAddress + `'
    ,E'` + row.respCity + `'
     ,E'` + row.respSt + `'
     ,` + row.respLat + `
     ,` + row.respLong + ` 
     ,` + row.event_id + ` 
     ,E'` + row.dayofWeek + `'
     ,E'` + row.fromTime + `'
    ,E'` + row.toTime + `'
    ,E'` + row.specialTxt + `'
     );
   `;
   client3 = new Client(db_credentials);
   console.log(qInsertAddress);
   client3.connect();
   client3.query(qInsertAddress, (err, res) => {
     client3.end();
     console.log(err, res);
    });

    setTimeout(callback,2500);
    });

console.log('*****finished filetodb');
return;
}

var fs = require('fs');
var objl
fs.readFile('./data/readyfordb.json', function (err, data){
   if (err) throw err;
   try {
   obj=JSON.parse(data);
   } catch (e) {
   return console.error(e);
   }
   filetodb(db_credentials, obj);
});




//addyArray = ['./data/AA06address.json', './data/AA07address.json'];
//console.log('Array = ' + addyArray);

/*
Promise.all(addyArray)
 .then(response => response.forEach(
   //response => console.log("test with promise"));
   response => console.log("test with promise"));

//json-merger

//filetodb(db_credentials,require(addyArray[i]), function(err) {
/*
function uploader(i) {
  if( i < addyArray.length ) {
    console.log('i =  ' + i);
    console.log('-> ArrayLength = ' + addyArray.length);
    filetodb(db_credentials,require(addyArray[i]), function(err) {
      
      if( err ) {
        console.log('error: '+err);
        console.log('@@@@@@@@@@@ERRORR@@@@@@@@@@@@@@@');
        console.log('@@@@@@@@@@@ERRORR@@@@@@@@@@@@@@@');
        console.log('@@@@@@@@@@@ERRORR@@@@@@@@@@@@@@@');
      }
      else {
        console.log('**Call uploader again*');
        uploader(i+1);
      }
     console.log ("Made it here....");
    });
  }
  console.log(" i = " + i);
}
*/


//uploader(0);



console.log('***end***');

//loadData(db_credentials, addyArray);
