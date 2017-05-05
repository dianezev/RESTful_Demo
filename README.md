## Demo: API Calls - Get NPR Stories with CORS ##
##### *By Diane Zevenbergen, dianezev@comcast.net* #####


&nbsp;
#### Purpose of this sample code: ####
* Demonstrate Cross Origin Resource Sharing (CORS) with a variety of API requests to get National Public Radio stories and listings (both client-side and server-side).
&nbsp;
* Use Node.js/Express to execute server-side requests.
&nbsp;
* Maintain privacy for API Key.
&nbsp;
* Process data returned in both XML and JSON formats.

#### Please note: ####
* The **'View listing'** feature is fully implemented.
* The **'Read news stories'** feature of this app is not yet live although the code is in place. (This feature requires Node.js and an API Key from National Public Radio.)
* To review the code for the **'Read news stories'** feature, please see **app.js** and **/public/js/index.js**.

#### Instructions to Programmers for Implementing the Node.js Feature: ####
* See http://www.npr.org/api/index.php for information on obtaining an API Key and http://www.npr.org/account/signup to signup.
&nbsp;
* Edit the **app.js** file by inserting your API Key as follows:
**`var apiKey = '<your API key goes here>';`**
&nbsp;
* Remove temporary code in **$goQuery.click** event in **/public/js/index.js **
* In Node.js Command Prompt window, run npm install as follows: **` npm install`**


 

#### To improve this application: ####

* Suggestions, comments and pull requests are all welcome! I'm new to this and always looking for ways to improve my skills.
&nbsp;
* Expand the dropdown options to include more choices for listings ('Show listings') and topics ('Read news stories'). To do this:
 1. Refer to API resources for NPR to get more codes:
   \- Codes for various listings: http://www.npr.org/api/inputReference.php
   \- Codes for topics: http://www.npr.org/api/mappingCodes.php
   \- General API info: http://www.npr.org/api/index.php 
&nbsp;
 2. Add new codes to portions of the _**index.html**_ file in the _**/public/**_ folder of this application. (see **`divs`** where **`id="listOptions"`** and **`id="articleOptions"`**).
&nbsp;
 3. Modify or add functions in _**app.js**_ and/or _**/public/js/index.js**_ as needed to adapt to any variations in formats of returned XML/JSON data.
* Add JavaScript code to dynamically generate the dropdowns for listing options and topic options instead of hardcoding these into the index.html.
