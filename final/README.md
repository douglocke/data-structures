<h2>Douglas Locke</h2>
<h2>Data Structures Final Projects</h2>

All 3 projects use a single server.js file.
Server is executed using "node server.js"
A default menu is generated upon "http://localhost:8080" or by passing "/menu".

<h2>Link</h2>
<a href="https://bit.ly/2ChvRqe">Live app running on AWS Beanstalk</a>

<h2>Video</h2>
I recorded a video of the app running on my local server.
<a href="https://www.youtube.com/watch?v=tfoUrmRGD1g&feature=youtu.be">
Video Link
</a>


<h2>Notes on AA:</h2> 

Mapping: Pins correspond to lat & long.
         Detail box captured 1 or more meeting times for the day.
         Details, affinity groups, wheelchair access, and start times made it in.
         
 
Default activity:  Brings up current day of week pins on NYC map.

Interactions:  Select day of week.

Differs from sketch design:  No detail box, only pin pop-up.  No current position vs. nearby meetings (distance measurement).
Major next steps:  Re-parse & discover why some locations didn't make it in.
		   Some geo coding markers ended up in Brooklyn.  

<h2>Special Notes on AA Maintainance</h2>

<h3>Monitor Weekly</h3>
          Review AWS Beanstalk performance, Usage, CPU, etc.
          Review AWS RDS performance & usage statistics.
          Review capacity
          Review Texas A&M Geocoding account and funding.
          Review AWS account & funding.

<h3>Monitor Monthly</h3>
          Detailed review of user paths, pages shown, interactions taken, etc.
          Unique & repeat users.
     

<h3>Quarterly Security Check</h3> 
          Node.js releases security patch
          Perform audit on application security - such as parameter passing via URL
                 
<h3>Weekly Source dependency Breakage Check</h3> 
          Check for changes in sourcing webpage format 
          Check for changes in Texas A&M Geocoding API
                 
<h3>Data Refresh</h3>  
          1.  Determine how often meeting data changes & adjust update schedule

<h3>Test Plan Creation</h3>  
          1.  A test plan should be created so before production deployments, the applicaiton should be tested for both functionality & performance.

<h3>Major Maintenance Tech Debt</h3>  
		      1 -  Build resuable geocode table to avoid unnessary parsing lookups. Especially true if update is done nightly to avoid geocoding charges.
                      2 -  Data update should run as a nightly server process.  Establish the process, which produces a full JSON of all meeting data.
                      3 -  Write a process to auto-check for integrity of parsing process.  E.g. some missing values still exists.
                      4 -  Parsing funciton & geo-code should be separated (abstracted) to 2 separate process.
                      5 -  Development & Deployment environments should be checked to ensure similiarty.  A "pre-production/test" environment can be created in AWS-Beanstalk.
                      6 -  Review URL paramter passing alternatives
                      7 -  Consider moving all parsing logic to its own process.

<h3>Deployment Steps</h3> 
                      Determine when usage time is lowest for Deployment, e.g. very early morning.

                      2 files and a folder must be deployed to AWS Beanstalk.
	              server.js  :  the main set of code for all 3 projects.
		      package.json  :  a configuration file that must have the name of the file to execute
                      a hidden folder called .ebextensions which contains another file, nodecommand.config.
                      nodecommand.config : this file tells node to initiate the package manager installer                                                 

		      To deploy, 
                      1) Prepare a new zipfile called "server.js" containing the files above.
                      2) log into AWS BeanStalk.
                      3) Find the application "LockeDataStructures"
                      4) From the dashboard click update & deploy.  Upload the zip file and change the version name to serverN where N is the next version number.
                      5) Test the URL.

                   
<h3>Training Up Additional Developers</h3>  
		      1 - Review all ReadMe notes 
	              2 - Perform code walkthrough
                      3 - Review DB & Elastic Beanstalk platrforms
                      4 - Review TechDebt items and assign
                      
		

<h2>Notes on Sensor</h2>

Mapping: Hourly average temperature to bar height.

Default Activity:  Displays room = kitchen.
 
Interactions:   Mouse over to highlight exact value.  Select different rooms at top (Kitchen, Garage, Office)

Differs from sketch design: I originally wanted to show two charts, emphasizing variance, and which room had the most.
			    Ultimaely I thought that was both complex & once the result was determined, there wouldn't be much need to show the data continuously.
	                    The hourly data here is actually more relevant.
			    If I had three sensors going, I would perhaps show the past 7 days average and compare across the rooms.
			 

<h2>Notes on Dear Diary</h2>

Mapping:  This is very straightforward table design.
          Fields map to individual row & table cells.

Default Activity:  Show the highest rated school related entries.

Differs from Sketch design:  Decided recency more important than just value alone.  Did not execute summary views

Interactions: Pick from School or Work views.  




