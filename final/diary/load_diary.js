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



diaryEntries.push(new DiaryEntry(13, "2018-12-09", "Maintainability","Kleppman", "Book Chapter", "School", "iPad", "Overview of software maintainability. Operability, Manage Compexity,and Evolvibility.",2));
diaryEntries.push(new DiaryEntry(12, "2018-12-02", "What is Code?","Paul Ford", "Article", "School", "iPad", "Sprawling tour through code and coding culture, from Bloomberg. Entertaining read.",5));
diaryEntries.push(new DiaryEntry(11, "2018-12-04", "Data Models and Query Languages ","Kleppman", "Book Chapter", "School", "iPad", "Comparing SQL and NoSQL approaches.",2));
diaryEntries.push(new DiaryEntry(10, "2018-12-02", "Map-Reduce","Dean and Ghemawat", "White Paper", "School", "iPad", "Seminal paper on both a programming model and implementation on processing large data sets.", 2));
diaryEntries.push(new DiaryEntry(9, "2018-12-02", "imMens: Real-time Visual Querying of Big Data ","Liu, Jiang, Heer", "White Paper", "School", "iPad", "Techniques to handle big data in web based visualizations with high reponse times.  Selecting millions of data points on map, and adjusting corresponding summary graphs. Using PNG for as data tiles.", 5));
diaryEntries.push(new DiaryEntry(8, "2018-11-27", "Using Ordinal values as independent variables", "Williams", "White Paper", "Work", "iPad", "Makes a case for using ordinal values as continuous variables.", 4));
diaryEntries.push(new DiaryEntry(7, "2018-11-18", "Redeisgning Design","Jos De Mul", "Blog Post", "School", "iPad", "Applying the open movement to design. Design as meta-design, creating user friendly design spaces so the user becomes co-designer.  Importance of databases as enablers.", 4));
diaryEntries.push(new DiaryEntry(6, "2018-11-04", "Data Models and Query Languages ","Kleppman", "Book Chapter", "School", "iPad", "Comparing SQL and NoSQL approaches.",5));
diaryEntries.push(new DiaryEntry(5, "2018-11-03", "From Measuring Desire to Quantifying Expectations-A nineteenth century effort to marry economic theory and data ","Brine and Poovey", "Book Chapter", "School", "iPad", "Irving Fisher uses highly mathematical approaches to explain economic behavior.  Fisher collects and scrubs data on interest rates, formatting, supplying missing data etc.  Interpolation techniques.", 2));
diaryEntries.push(new DiaryEntry(4, "2018-10-20", "Where is that Moon Anyay? The Problem of Interpreting To Insights", "Mathew Stanley", "Book Chapter", "School", "iPad", "Data quality and capturing of eclipse data.", 4));
diaryEntries.push(new DiaryEntry(3, "2018-10-19", "For Big Data Scientists, Janitor Work is Key Hurdle To Insights", "NY Times", "Article", "School", "iPad", "Article presents a negative view of data preparastion for data scientists. Class discussion focused on is this appropritate given the necessity of understanding data before using it.", 5));
diaryEntries.push(new DiaryEntry(2, "2018-10-18", "NoSql and SQL Physical Design", "Ted Hill", "Book Chapter", "School", "Paperback", "Explains differences between SQL and NoSQL systems.  NoSQL scales horizontally, data not always available, some updates lost, and copies may be out of sync.", 4));
diaryEntries.push(new DiaryEntry(1, "2018-10-11", "Papers As Passion, Niklas Luhmann and his card index", "Markus Krajewski", "Book Chapter", "School", "iPad", "Luhmanns slip-box was an analog notetaking organization system.  Physically cumbersome but its organization actually helped generate new ideas upon interaction.", 5));
diaryEntries.push(new DiaryEntry(0, "2018-10-05", "Distribution and Adoption", "Limra", "Whitepaper", "Work", "Laptop", "Observational study examining survey responses from financial advisorys Argues that mentor-mentee relationships are best when mentor dominates.", 4));


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
