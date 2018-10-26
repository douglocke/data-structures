var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

// Locke Reading Diary


var dynamodb = new AWS.DynamoDB();



// after much digging, figured out parition key is only queryable by an equality operator.
// will re-visit this and consider a parition key with multiple fields 


var params = {
    TableName : "deardiary",
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"},  //Partition key
        { AttributeName: "purpose", KeyType: "RANGE" }  //Sort key
//        { AttributeName: "value", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "id", AttributeType: "N" },
        { AttributeName: "purpose", AttributeType: "S" }
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



/*************/
  //constructor(id, date, title, author, format, purpose, device, experience, value) {
