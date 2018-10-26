// Assignment 6
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

// Locke Reading Diary

var diaryEntries = [];

class DiaryEntry {
  constructor(id, date, title, author, format, purpose, device, experience, value) {

    this.id = {};
    this.id.N = id.toString();

    this.date = {};
    this.date.S = date;

    this.title = {};
    this.title.S = title;

    this.author = {};
    this.author.S = author;

    this.format = {};
    this.format.S = format;

    this.purpose = {};
    this.purpose.S = purpose;

    this.device = {};
    this.device.S = device;

    this.experience = {};
    this.experience.S = experience;

    this.value = {};
    this.value.N = value.toString();

    //this.happy = {};
    //this.happy.BOOL = happy; 

    //if (iate != null) {
    //  this.iate = {};
    //  this.iate.SS = iate; 
    }
    //this.month = {};
    //this.month.N = new Date(date).getMonth().toString();
  }


diaryEntries.push(new DiaryEntry(0, "10.11.2018", "Distribution and Adoption", "Limra", "Whitepaper", "Work", "Laptop", "Observational study examining survey responses from financial advisorys Argues that mentor-mentee relationships are best when mentor dominates.", 8));

diaryEntries.push(new DiaryEntry(1, "10.5.2018", "Papers As Passion, Niklas Luhmann and his card index", "Markus Krajewski", "Book Chapter", "School", "iPad", "Luhmanns slip-box was an analog notetaking organization system.  Physically cumbersome but its organization actually helped generate new ideas upon interaction.", 6));

diaryEntries.push(new DiaryEntry(2, "10.4.2018", "NoSql and SQL Physical Design", "Ted Hill", "Book Chapter", "School", "Paperback", "Explains differences between SQL and NoSQL systems.  NoSQL scales horizontally, data not always available, some updates lost, and copies may be out of sync.", 8));

diaryEntries.push(new DiaryEntry(3, "10.19.2018", "For Big Data Scientists, Janitor Work is Key Hurdle To Insights", "NY Times", "Article", "School", "iPad", "Article presents a negative view of data preparastion for data scientists. Class discussion focused on is this appropritate given the necessity of understanding data before using it.", 10));

diaryEntries.push(new DiaryEntry(4, "10.19.2018", "Where is that Moon Anyay? The Problem of Interpreting To Insights", "Mathew Stanley", "Book Chapter", "School", "iPad", "Data quality and capturing of eclipse data.", 7));

console.log(diaryEntries);


//console.log(JSON.stringify(diaryEntries));

// This code felt like a "Settle" when DocClient didn't work 

// This code was successful

var dynamodb = new AWS.DynamoDB();
var params = {};

for (j = 0; j < diaryEntries.length ; j++)
    {
    //makerequest(pages[j], filename[j]);
    console.log("---------->  Made request for: " + j);
    params.Item = diaryEntries[j]; 
    params.TableName = "deardiary";
    dynamodb.putItem(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     
       console.log(data);           // successful response
       console.log("Done");           // successful response
      });

    }


// THIS WORKS FOR SINGLE ROW
/*
var dynamodb = new AWS.DynamoDB();
var params = {};
params.Item = diaryEntries[0]; 
params.TableName = "deardiary";
dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
//END SINGLE ROW
*/

/* DOCCLIENT VERSION 
//This method is doclient but was getting config error
//tried to use the DocumentClient function in AWS

var docClient = new AWS.DynamoDB.DocumentClient();
console.log("Importing entries into DynamoDB. Please wait.");
//var allReadItems = JSON.parse(jsontxt);
//console.log("--------------allReadItems -------------");
//console.log(allReadItems);
//var allReadItems = JSON.parse(jsontxt);
//var jsontxt = JSON.stringify(diaryEntries);

diaryEntries.forEach(function(readitem) {
    let params = {
        TableName: "deardiary",
        Key: {  
            "pk":  readitem.pk
          },
        Item: {
            "pk":  readitem.pk,
            "date": readitem.date,
            "title":  readitem.title,
            "author":  readitem.author,
            "format":  readitem.format,
            "purpose":  readitem.purpose,
            "device":  readitem.device,
            "experience":  readitem.experience,
            "value":  readitem.value
        }
    };
    console.log("**********************************");
    console.log(params);

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add readitem", readitem.title, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", readitem.title);
       }
    });
});
//    setTimeout(callback, 1000); 

*/
