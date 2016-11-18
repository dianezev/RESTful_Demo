'use strict';

var express = require('express');
var req = require('request');

var myBody;

var port = process.env.PORT || 3001;
var app = express();

// Add VALID API KEY HERE (from http://www.npr.org/account/signup)
var apiKey = 'your API key goes here in single quotes';

/*
 * Note: for Github use the following for line 12 instead of actual API key
 * var apiKey = 'your API key goes here in single quotes';
 * This msg alerts user if they haven't modified line 12 above with an API key
 */
if (apiKey.slice(0,4) === "your") {
    console.log('Error: You need to add your API Key to the app.js file in order for this to work. See more info in README.md')
}

app.use(express.static(__dirname + '/public'));

app.use(function (request, response, next) {
    // experiment with custom middleware fcn...
    next();
});

app.get('/cors', function (request, response) {
    var href = request.query.href;
    var id = request.query.id;
    var output = request.query.output;

    //console.log('request.query from GET is');
    //console.log(request.query);
    
    var storyArray;
    
    // Question: when I use req module, is API key visible to client?
    
    var url = href + 
            'query?id=' + id + 
            '&output=' + output + 
            '&apiKey=' + apiKey;

    req(url, function(error, res, body) {
        storyArray = getStories(JSON.parse(body));
        response.send(storyArray);        
    });
});

// Note to self: request.query depends on ajax POST call specifying query string in url
app.post('/cors', function (request, response) {

    var href = request.query.href;
    var id = request.query.id;
    var output = request.query.output;
        
    var storyArray;
    
    var url = href + 
            'query?id=' + id + 
            '&output=' + output + 
            '&apiKey=' + apiKey;

    req(url, function(error, res, body) {
        storyArray = getStories(JSON.parse(body));
        response.send(storyArray);        
    });    
});

function getStories(data) {
    var dataArray = data.list.story;
    var story = '';
    var paraArray;
    var title;
    var link;
    var storyDate;

    for (var i = 0, l = dataArray.length; i < l; i++) {
        paraArray = dataArray[i].textWithHtml.paragraph;
        storyDate = new Date(dataArray[i].storyDate.$text);
        title = dataArray[i].title.$text;
        link = dataArray[i].link[0].$text;
        story += '<li><p class="title">'
                    + '<a href="' + link + '" target="_blank">'
                        + title
                    + '</a></p>'
                    + '<small>' + storyDate + '</small><br>';
        for (var j = 0, m = paraArray.length; j < m; j++) { 
            if (typeof paraArray[j].$text !== 'undefined') {
                story += '&nbsp;&nbsp;&nbsp;&nbsp;' 
                        + paraArray[j].$text
                        + '<br>';
            }
        }
        story += '</li><br>';
    }
    
    return story;
}

if(!module.parent){
  app.listen(port, function(){
    console.log('Express app listening on port ' + port + '.');
  });
}
