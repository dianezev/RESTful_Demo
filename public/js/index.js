/*
 * Developer: Diane Zevenbergen, dianezev@comcast.net
 * August 2016
 *
 * Various ways to request & render NPR data - for comparison.
 *
 * Note LISTINGS from NPR do not require an API Key
 * but ARTICLES do require a key.
 *
 * To keep the API key private when requesting STORIES,
 * use node.js/Express to make a server-side request.
 * (TBD: verify that it won't show up in url, etc.)
 *
 * For LISTINGS (which do not require API key), make request
 * from client.
 *
 * *
 * Examples below include the following types of requests from CLIENT:
 *      1. GET & POST ajax calls for XML data (for NPR listing with no key)
 *      2. GET & POST ajax calls for JSON data (for NPR listing with no key)
 *
 * Examples below include the following types of requests from SERVER, 
 *      using node.js/Express routing: (all of these request NPR stories 
 *      which require API key, which is embedded in server file app.js)
 *      1. .ajax call (method GET) for JSON data (includes data property in request object)
 *      2. .get call for JSON data (passes query object in .get call)
 *      3. .ajax call (method POST) for JSON data (query string is in url)
 *
 */

'use strict';

$(function(){
    var template = $('#template').html();
    var href = 'http://api.npr.org/';
    var listParser;
        
    var $goQuery = $('[id^=goQuery]');
    var $articleOpt = $('#articleOptions');
    var $listOpt = $('#listOptions');
    var $result = $('#result ul');
    var $resultDesc = $('h1.describe');
    var $error = $('#result p.error');
    var categ;

    // Initially hide details
    $('[id$=Options]').hide();
    $resultDesc.hide();
    
    // Hide/show options based on user selection
    $('[id^=tog]').click(function() {
        var idToShow = this.nextElementSibling.id;

        $('[id$=Options]').hide();
        $('#' + idToShow).show();
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
        
        $('body').addClass('wait');
        
        $resultDesc.text('Please wait...');
        $resultDesc.show();

        // Request data for listing depending on user options
        if ($listOpt.is(':visible') === true) {
            id = $('select[name=lists]').val();
            categ=$('select[name=lists] option:selected').text();
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
            categ=$('select[name=articles] option:selected').text();
            keyMethod = $('select[name=keyMethod]').val();
            output = 'JSON';
            
            
            /*
             * Code samples: These methods get the same data in slightly 
             * different ways, but all use node.js with API Key in
             * the server side node file.
             *
             * Use node.js/Express routing to process GET request on server side.
             * This example uses AJAXs' data property to pass query object.
             */
            if (keyMethod === 'GET2') {

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

        // Hide options
        $('[id$=Options]').hide();        

        e.preventDefault();
    });

    // Clear results area whenever user selects different option
    function clearResults() {
        $result.text('');
        $error.text('');
        $resultDesc.hide();
    }

    /*
     * This is called by the success functions in AJAX calls from CLIENT.
     */
    function showResults (data, res, parser) {
        var results = '';

        $resultDesc.text('NPR listing of "' + categ + '"');
        
        if (data) {
            results = parser(data);
            $result.html(results);
        } else {
            $result.text('STATUS CODE: ' + res.status);
        }
        $('body').removeClass('wait');
    }    
    
    function showError (state) {
        $resultDesc.text('Error occurred...');
        $result.addClass('error');
        $error.text(state);
        $('body').removeClass('wait');
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
            listing += '<li><p class="title">' + allTitles[i].getElementsByTagName('title')[0].textContent + '</p>'
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
            listing += '<li><p class="title">' + dataArray[i].title.$text + '</p>'
            + dataArray[i].additionalInfo.$text + '</li><br>';
        }

        return listing;
    }

    /******************************************************************************************
     * Code below handles requests that are processed & formatted with Express routing/node.js
     ******************************************************************************************/    
    /*
     * This is called by the success functions that
     * handle AJAX calls from SERVER using node.js.
     */
    function nodeSuccess (results) {
        $resultDesc.text('NPR articles for "' + categ + '"');

        if (results) {
            $result.html(results);
        } else {
            $result.text('STATUS CODE: ' + res.status);
        }
        $('body').removeClass('wait');
    }
});
    