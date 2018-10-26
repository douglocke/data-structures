//assignment 6

var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";


//  constructor(id, date, title, author, format, purpose, device, experience, value) {

var dynamodb = new AWS.DynamoDB();

var params = {};
// npm install aws-sdk

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

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});
