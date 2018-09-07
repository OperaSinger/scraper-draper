#Scraper Draper
​
- A scraping app utilizing the cheerio package to scrape, in this case, the NY Times main page to find 10 of the top headlines of the day
​
##Getting started
​
To test and use this app on your local machine, you will have to download this GIT project in its entirety. If not viewing on HEROKU, you will have to build your own database using the models for the database using Mongoose for MongoDB provided within the app. 
​
Incorporate the‘npm install’ command after you have first initialized NPM in your file - to then get the correct dependencies. 
​
Those NPM modules include:
​
request - to govern the request action 
Mongoose
MongoDB
Cheerio
axios
Body-parser
Handlebars
Morgan
​
##Functionality
​
When all files are installed, at the command line, start the app in your terminal using either NODEMON or NODE followed by 'server.js', Then within your browser, you would have to type, in the command line:

​
localhost://3000
​

- This will start the app in the browser window, initiate a scrape of the NY Times page for the 10 top headlines - each with their link associated to read in their entirety - in a carousel. The user may scroll through all 10 articles and take notes based on each article - notes which will then be prepended to the list on the right of each card which is scrollable. 

​
- To view video of app functionality, <a href="https://github.com/OperaSinger/scraper-draper/blob/master/Vale%20Rideout%20-%20Scraper%20App.mp4">click here</a>.

​
##Built with:
​
- Javascript
- node.js
- handlebars
- mongodb
- mongoose
- cheerio
- body parser
- express
​
###Author: 
​
Vale Rideout
​
Acknowledgements
​
Thanks much to the instructors, TA’s and Tutors through Rutgers CS Bootcamp, 2018
