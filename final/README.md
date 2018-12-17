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

