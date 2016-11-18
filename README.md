## RESTful API Demo ##
#####*By Diane Zevenbergen, dianezev@comcast.net*#####


&nbsp;
####Purpose of this sample code:####
* Demonstrate a variety of cross-domain ajax requests from National Public Radio (both client-side and server-side).
&nbsp;
* Use Node.js/Express to execute server-side requests.
&nbsp;
* Maintain privacy for API Key.
&nbsp;
* Process data returned in both XML and JSON formats.

####Requirements:####
* For full functionality, a Node.js server and an API Key from National Public Radio is needed. (Without these, you can still demo the *'Show listing'* option.)
&nbsp;
* To obtain an API Key, see http://www.npr.org/api/index.php for information and http://www.npr.org/account/signup to signup.
&nbsp;
* Edit line 12 of app.js file by inserting your API Key as follows:
**`var apiKey = '<your API key goes here>';`**


####To run the app locally (with Node.js):####

* In Node.js Command Prompt window, set the current directory to the folder
  that contains this application and run app.js as follows: **` node app.js`**
&nbsp;
* In your browser, go to __*localhost:3001*__

* To show a listing of topics/music genres/programs available from NPR:
 1. Click on *'Show listing'*.
 &nbsp;
 2. Select an option from the *'For'* dropdown. 
 &nbsp;
 3. Optional: Select any combination of *'Format'* and *'Method'* options. (These options exist only to demonstrate various ways to make HTTP requests - the results are the same for any format/method.)
 &nbsp;
 4. Click on *'Request NPR Listing'* to view results.

* To show current NPR articles for a topic:
 1. Click on *'Show articles'*.
 &nbsp;
 2. Select an option from the *'Topic'* dropdown. 
 &nbsp;
 3. Optional: Select any *'Method'* option. (This option exists only to demonstrate various ways to make HTTP requests - the results are the same for any method.)
 &nbsp;
 4. Click on *'Request NPR Articles'* to view results.
 
####To run the app from the browser (without Node.js):####

* In your browser, open the _**index.html**_ file in the _**/public/**_ folder of this application.
&nbsp;
* To show a listing of topics/music genres/programs available from NPR, follow steps outlined above.
&nbsp;
* Note that without Node.js and a valid API Key, the *'Show articles'* option does not work.
 
####To improve this application:####

* Suggestions, comments and pull requests are all welcome! I'm new to this and always looking for ways to improve my skills.
&nbsp;
* Expand the dropdown options to include more choices for listings ('Show listings') and topics ('Show articles'). To do this:
 1. Refer to API resources for NPR to get more codes:
   \- Codes for various listings: http://www.npr.org/api/inputReference.php
   \- Codes for topics: http://www.npr.org/api/mappingCodes.php
   \- General API info: http://www.npr.org/api/index.php 
&nbsp;
 2. Add new codes to portions of the _**index.html**_ file in the _**/public/**_ folder of this application. (see **`divs`** where **`id="listOptions"`** and **`id="articleOptions"`**).
&nbsp;
 3. Modify or add functions in _**app.js**_ and/or _**/public/js/index.js**_ as needed to adapt to any variations in formats of returned XML/JSON data.
* Add JavaScript code to dynamically generate the dropdowns for listing options and topic options instead of hardcoding these into the index.html.
