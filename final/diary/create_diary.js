
//Doug Locke
//For the final project, I re-did the partition and sort key.
//the most likely to be queried fields:
//Value = likert scale 1-5.  If I liked somthing a lot, its a 4 or 5.
//find those valuable entries, with recency.

var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

// Locke Reading Diary


var dynamodb = new AWS.DynamoDB();



// after much digging, figured out parition key is only queryable by an equality operator.
// this is the re-worked key

var params = {
    TableName : "deardiary",
    KeySchema: [       
        { AttributeName: "purpose", KeyType: "HASH" },  //partiion key
        { AttributeName: "date", KeyType: "RANGE" }  //RANGE key
//        { AttributeName: "value", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "purpose", AttributeType: "S" },
        { AttributeName: "date", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 9));
    }
});

