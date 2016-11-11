(function(ext) {

    startExt();
    var responseObj;
    var cacheDuration = 1800000 //ms, 30 minutes
    var cachedTemps = {};

    function startExt(callback) {

        var url_beginning = 'https://www.eventbriteapi.com/v3/events/29121571404/?token=WFGW7FS5KX72BLBLZUXN';

        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                var eventData = JSON.parse(request.responseText);
                responseObj = eventData;
                cachedTemps = {data: eventData, time: Date.now()};
                callback('');
                //callback(response.name.text);
            }
        }

        /*if (cachedTemps.hasOwnProperty(time) && Date.now() - cachedTemps.time < cacheDuration) {
         //Event data is cached
         responseObj = cachedTemps.data;
         callback('');

         }*/

        request.open("GET", url_beginning);
        request.send();

    }

    // Cleanup function when the extension is unloaded
    ext._shutdown = function () {
        startExt();
    };

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function () {
        return {status: 2, msg: 'Ready'};
    };

    ext.getEvent = function(callback) {
        startExt(callback);
    }

    ext.getEventName = function (callback) {
        callback(responseObj.name.text);
    }

    ext.getEventDescription = function (callback) {
        callback(responseObj.description.text);
    }

    ext.getEventDate = function (type, callback) {
        var dateVal = null;
        if (type === 'start') {
            dateVal = responseObj.start.local.substr(11, 5);
        } else {
            dateVal = responseObj.end.local.substr(11, 5);
        }
        callback(dateVal);
    }

    ext.getEventUrl = function (callback) {
        var output = (responseObj.vanity_url !== '') ? responseObj.vanity_url : responseObj.url;
        callback(output);
    }

    ext.getMaxAttendees = function (callback) {
        callback(responseObj.capacity);
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            //['w', 'wait for random time', 'wait_random'],
            ['R', 'Get Event', 'getEvent'],
            ['R', 'Event name', 'getEventName'],
            ['R', 'Event description', 'getEventDescription'],
            ['R', 'Event %m.dateType date', 'getEventDate'],
            ['R', 'Event url', 'getEventUrl'],
            ['R', 'Max attendees', 'getMaxAttendees']
        ],
        menus: {
            dateType: ['start', 'end']
        }
    };

    // Register the extension
    ScratchExtensions.register('CoderDojo Bologna Events', descriptor, ext);
})({});