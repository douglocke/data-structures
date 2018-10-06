
const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'dlocke';
db_credentials.host = 'douginstance.cfbmsiuau7cc.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;


function filetodb(db_credentials, addressTable) {
  console.log("Calling filetodb");
  //console.log("addressTable" + addressTable);
  var blank = 'na';
  var Vasync = require('async');
  Vasync.eachSeries(addressTable, function(row,callback) {
    let qInsertAddress = `
      INSERT INTO address VALUES
      (
         ` + row.id + `
        ,'` + blank + `'
        ,'` + blank + `'
        ,'` + blank + `'
        ,'` + blank + `'
        ,'` + blank + `'
        ,'` + row.respAddress + `'
        ,'` + row.respCity + `'
        ,'` + blank + `'
        ,'` + blank + `'
        ,` + row.respLat + `
        ,` + row.respLong + `
      );
    `;
    client3 = new Client(db_credentials);
    console.log(qInsertAddress);
    client3.connect();
    client3.query(qInsertAddress, (err, res) => {
       client3.end();
      console.log(err, res);
    });

    // console.log(qInsertAddress);
    //console.log("callback = " + callback);
    setTimeout(callback,1000);
    });

/*
    setTimeout(callback,500);
  }, function() {
    console.log('*****timeout******');
  });
*/
console.log('*****finished filetodb');
return;
}



addyArray = ['./data/AA06address.json', './data/AA07address.json'];
console.log('Array = ' + addyArray);

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

uploader(0);
console.log('***end***');

//loadData(db_credentials, addyArray);
