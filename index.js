'use strict';
var webshot = require('webshot');
var eachAsync = require('each-async');
var slugifyUrl = require('slugify-url');

function generateSizes(shot, sizes, cb) {
    eachAsync(sizes, function(el, i, next) {
        // strip `www.` and convert to valid filename
        var filenameUrl = slugifyUrl(shot.url.replace(/^(?:https?:\/\/)?www\./, ''));
        filenameUrl += '-' + el;
        var baseName = shot.filePath || filenameUrl;
        var filename = baseName + '.png';

        var dim = el.split(/x/i);
        var options = {
            windowSize: {
                width: dim[0],
                height: dim[1]
            },
            shotSize: {
                width: 'window',
                height: 'all'
            }
        };

        webshot(shot.url.toLowerCase(), filename, options, next);
    }, cb);
}

module.exports = function(shots, sizes, cb) {
    cb = cb || function() {};

    if (shots.length === 0) {
        return cb(new Error('`shots` required'));
    }

    if (sizes.length === 0) {
        return cb(new Error('`sizes` required'));
    }

    eachAsync(shots, function(url, i, next) {
        generateSizes(url, sizes, next);
    }, cb);
};
