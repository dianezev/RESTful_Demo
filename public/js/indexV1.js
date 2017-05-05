/*
 * Developer: Diane Zevenbergen, dianezev@comcast.net
 * August 2016
 *
 * Various ways to request & render NPR data - for comparison.
 *
 * Note LISTINGS from NPR do not require an API Key
 * but STORIES do require a key.
 *
 * If data requiring an API key is requested via CLIENT, then
 * API key is stored in this file & visible to user in browser.
 * (TBD later: what if key is kept in PHP file?)
 *
 * If request is from SERVER via node.js/Express, I think
 * API key is not visible to user since it can be stored in
 * the server.js file (and there's no need for it to be defined in this client file).
 *
 * Question: When data is requested via node.js/Express, will API key display
 * in the url?
 *
 * Examples below include the following types of requests from CLIENT:
 *      1. GET & POST ajax calls for XML data (for NPR listing with no key)
 *      2. GET & POST ajax calls for JSON data (for NPR listing with no key)
 *      3. GET ajax call for JSON data (for NPR story with API key)
 *
 * Examples below include the following types of requests from SERVER, 
 *      using node.js/Express routing: (all of these request NPR stories 
 *      which require API key, which is embedded in server file)
 *      1. .ajax call (method GET) for JSON data (includes data property in request object)
 *      2. .get call for JSON data (passes query object in .get call)
 *      3. .ajax call (method POST) for JSON data (query string is in url)
 *
 */


$(function(){
    var template = $('#template').html();
    var href = 'http://api.npr.org/';
    
    /*
     * The apiKey here is used to make http request from CLIENT for articles,
     * which makes the key visible in the browser.
     * Note some OTHER examples below request articles
     * FROM the server using node.js/Express routing which I think 
     * can keep API key private 
     *(since apiKey can be defined in app.js server file instead)
     */
    var apiKey = 'MDI0NjI0NTU3MDE0NjYwMjE0ODFjMGU1OQ000';
    
    var $goQuery = $('#goQuery');
    var $articleOpt = $('#articleOptions');
    var $listOpt = $('#listOptions');
    var $radios = $('input:radio[name=npr_type]');
    var $result = $('#result ul');
    var $error = $('#result p.error');

    if($radios.is(':checked') === false) {
        $radios.filter('[value=lists]').prop('checked', true);
        $articleOpt.hide();
    }
    
    // Bind click event for radio buttons
    $radios.change(function(e) {
        if (e.target.id === 'getArticles') {
            $radios.filter('[value=articles]').prop('checked', true);
            $listOpt.hide(); 
            $articleOpt.show();
        } else {
            $radios.filter('[value=lists]').prop('checked', true);
            $articleOpt.hide();
            $listOpt.show();
        }
        clearResults();
    });

    // Bind click event for article options
    $articleOpt.change(function(e) {
        clearResults();
    });

    // Bind click event for list options
    $listOpt.change(function(e) {
        clearResults();
    });
    
    // Bind click event for Submit button    
    $goQuery.click(function(e) {
        var id;
        var output;
        var method;
        var keyMethod;
        var url;
        var reqObject;
        var myRoute;

        // Request data for listing depending on user options
        if ($listOpt.is(':visible') === true) {
            id = $('select[name=lists]').val();
            output = $('select[name=format]').val();
            method = $('select[name=method]').val();
            
            if (output === 'XML') {
                listParser = listFromXML;
                url = href + 'list?' +
                        'id=' + id;
                
            } else if (output === 'JSON') {
                listParser = listFromJSON;
                url = href + 'list?' +
                        'id=' + id +
                        '&output=' + output;
            }
            
            reqObject = {
                url: url,
                dataType: output,
                method: method,
                success: function (data, state, res) {
                    showResults(data, res, listParser);
                },
                error: function (data, state) {
                    showError(state);
                }            
            };

            $.ajax(reqObject);
            
        // Note that API key is req'd to get articles
        } else if ($articleOpt.is(':visible') === true) {
            id = $('select[name=articles]').val();
            keyMethod = $('select[name=keyMethod]').val();
            output = 'JSON';
            
            
            /*
             * Code samples: These methods get the same data in different ways.
             *
             * First method processes the request from client side & 
             * other methods process from server side (To confirm: I believe the 
             * API key can be kept private when request happens on server side
             * using node.js/Express routing
             * since the key can be defined in the server file & could be excluded
             * from this file which is visible in browser).
             */
            if (keyMethod === 'GET1') {                
                reqObject = {
                    url: href + 'query?' +
                        'id=' + id +
                        '&output=' + output +
                        '&apiKey=' + apiKey,
                    dataType: output,
                    method: 'GET',
                    success: function (data, state, res) {
                        showResults(data, res, storyFromJSON);
                    },
                    error: function (data, state) {
                        showError(state);
                    }
                };
                
                $.ajax(reqObject);
            
            /*
             * Use node.js/Express routing to process GET request on server side.
             * This example uses AJAXs' data property to pass query object.
             */
            } else if (keyMethod === 'GET2') {

                reqObject = {url: '/cors',
                            method: 'GET',
                            data: {href: href, id: id, output: output},
                            success: nodeSuccess
                        };
                $.ajax(reqObject);
                
            /*
             * Use node.js/Express routing to process GET request on server side.
             * This example passes a query argument instead of
             * using the data property.
             */
            } else if (keyMethod === 'GET3') {
                
                $.get('/cors', {href: href, id: id, output: output}, nodeSuccess);

            /*
             * Use node.js/Express routing to process POST request on server side.
             * This example includes a query string in the url
             */
            } else if (keyMethod === 'POST') {

                myRoute = '?href=' + href + '&id=' + id + '&output=' + output;
                
                reqObject = {url: '/cors' + myRoute,
                            method: 'POST',
                            success: nodeSuccess
                        };
                $.ajax(reqObject);
            }
        }

        e.preventDefault();
    });

    // Clear results area whenever user selects different option
    function clearResults() {
        $result.text('');
        $error.text('');
    }

    /*
     * This is called by the success functions in AJAX calls from CLIENT.
     */
    function showResults (data, res, parser) {
        var results = '';

        if (data) {
            results = parser(data);
            $result.html(results);
        } else {
            $result.text('STATUS CODE: ' + res.status);
        }                
    }    
    
    function showError (state) {
        $result.addClass('error');
        $error.text(state);
    }

    /*
     * Called by fcn showResults
     * Parses XML data returned from AJAX call from CLIENT
     * Based on NPR API format information for XML formatted listings
     */
    function listFromXML(data) {
        var allTitles = data.getElementsByTagName('item');
        var listing = '';

        for (var i = 0, l = allTitles.length; i < l; i++){
            listing += '<li><strong>' + allTitles[i].getElementsByTagName('title')[0].textContent + '</strong><br>'
            + allTitles[i].getElementsByTagName('additionalInfo')[0].textContent + '</li><br>';
        }

        return listing;
    }

    /*
     * Called by fcn showResults
     * Parses JSON data returned from AJAX call from CLIENT
     * Based on NPR API format information for JSON formatted listings
     */
    function listFromJSON(data) {
        var dataArray = data.item;
        var listing = '';

        for (var i = 0, l = dataArray.length; i < l; i++){
            listing += '<li><strong>' + dataArray[i].title.$text + '</strong><br>'
            + dataArray[i].additionalInfo.$text + '</li><br>';
        }

        return listing;
    }

    /*
     * Called by fcn showResults
     * Parses JSON data returned from AJAX call from CLIENT
     * Based on NPR API format information for stories
     */
    function storyFromJSON(data) {
        var dataArray = data.list.story;
        var story = '';
        var paraArray;

        for (var i = 0, l = dataArray.length; i < l; i++) {
            paraArray = dataArray[i].text.paragraph;
            story += '<li><strong>' + dataArray[i].title.$text + '</strong><br>';
            for (var j = 0, m = paraArray.length; j < m; j++) { 
                if (typeof paraArray[j].$text !== 'undefined') {
                    story += '&nbsp;&nbsp;&nbsp;&nbsp;' 
                            + paraArray[j].$text
                            + '<br><br>';
                }
            }
            story += '</li><br>';
        }
        
        return story;
    }

    /******************************************************************************************
     * Code below handles requests that are processed & formatted with Express routing/node.js
     ******************************************************************************************/    
    /*
     * This is called by the success functions that
     * handle AJAX calls from SERVER using node.js.
     */
    function nodeSuccess (results) {
        if (results) {
            $result.html(results);
        } else {
            $result.text('STATUS CODE: ' + res.status);
        }
    }
});
    