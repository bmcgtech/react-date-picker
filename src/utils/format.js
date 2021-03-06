'use strict';

var CONFIG   = require('../config');
var toMoment = require('../toMoment');
var moment = require('moment');

function f(mom, format){
    return toMoment(mom).format(format)
}

module.exports = {
    day: function(mom, format) {
        return f(mom, format || CONFIG.dayFormat)
    },

    month: function(mom, format) {
        return f(mom, format || CONFIG.monthFormat)
    },

    year: function(mom, format) {
        return f(mom, format || CONFIG.yearFormat)
    },

    getYearText: function(yearText) {
        var year = moment().year(yearText).year()
        if (year >= 1912 && year <= 1926) {
            return 'T' + yearText;
        }
        else if (year >= 1927 && year <= 1988) {
            return 'S' + yearText;
        }
        else if (year >= 1989 && year <= 2015) {
            return 'H' + yearText;
        }
        return yearText;
    }
}