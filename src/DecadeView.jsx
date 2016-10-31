'use strict';

var React  = require('react');
var moment = require('moment');
var assign = require('object-assign');

var FORMAT   = require('./utils/format');
var asConfig = require('./utils/asConfig');
var toMoment = require('./toMoment');
var onEnter  = require('./onEnter');

import {CALENDAR_TYPES} from './japaneseLanguageUtilities/enumerations/calendarTypes';
import {LANGUAGES} from './japaneseLanguageUtilities/enumerations/languages';

import {getDecadeViewHeaderText} from './japaneseLanguageUtilities/getDecadeViewHeaderText';
import {getEra} from './japaneseLanguageUtilities/enumerations/getEra';
import {getImperialYear} from './japaneseLanguageUtilities/getImperialYear';
import {ERA_SYMBOLS} from './japaneseLanguageUtilities/enumerations/eraSymbols';

var TODAY;

function emptyFn(){}

var DecadeView = React.createClass({

    displayName: 'DecadeView',

    getDefaultProps: function() {
        return asConfig();
    },

    /**
     * Returns all the years in the decade of the given value
     *
     * @param  {Moment/Date/Number} value
     * @return {Moment[]}
     */
    getYearsInDecade: function(value){
        var year = moment(value).get('year');
        var offset = year % 10;

        year = year - offset - 1;

        var result = [];
        var i = 0;

        var start = moment(year, 'YYYY').startOf('year');

        for (; i < 12; i++){
            result.push(moment(start));
            start.add(1, 'year');
        }

        return result
    },

    render: function() {

        TODAY = +moment().startOf('day');

        var props = assign({}, this.props);

        var viewMoment = props.viewMoment = moment(this.props.viewDate);

        if (props.date){
            props.moment = moment(props.date).startOf('year');
        }

        var yearsInView = this.getYearsInDecade(viewMoment);

        return (
            <table className="dp-table dp-decade-view">
                <tbody>
                    {this.renderYears(props, yearsInView)}
                </tbody>
            </table>
        )
    },

    /**
     * Render the given array of days
     * @param  {Moment[]} days
     * @return {React.DOM}
     */
    renderYears: function(props, days) {
        var nodes      = days.map(function(date, index, arr){
            return this.renderYear(props, date, index, arr)
        }, this)
        var len        = days.length;
        var buckets    = [];
        var bucketsLen = Math.ceil(len / 4);

        var i = 0;

        for ( ; i < bucketsLen; i++){
            buckets.push(nodes.slice(i * 4, (i + 1) * 4));
        }

        return buckets.map(function(bucket, i){
            return <tr key={"row" + i} >{bucket}</tr>
        })
    },

    renderYear: function(props, date, index, arr) {
        debugger;
        var imperialYear, era;
        var yearText = FORMAT.year(date, props.yearFormat);
        var currentLanguage = props.currentLanguage;
        var classes = ["dp-cell dp-year"];

        var dateTimestamp = +date;

        if (dateTimestamp == props.moment){
            classes.push('dp-value');
        }

        if (!index){
            classes.push('dp-prev');
        }

        if (index == arr.length - 1){
            classes.push('dp-next');
        }

        var onClick = this.handleClick.bind(this, props, date);

        var text;

        if (currentLanguage === LANGUAGES.JAPANESE_LANGUAGE) {
            if (props.calendar === CALENDAR_TYPES.IMPERIAL) {
                era = ERA_SYMBOLS[currentLanguage][getEra(date)];
                imperialYear = getImperialYear(date);
                text = `${era}${imperialYear}`;
            } else if (props.calendar === CALENDAR_TYPES.GREGORIAN) {
                text =  yearText;
            }
        } else if (currentLanguage === LANGUAGES.ENGLISH_LANGUAGE) {
            if (props.calendar === CALENDAR_TYPES.IMPERIAL) {
                era = ERA_SYMBOLS[currentLanguage][getEra(date)];
                imperialYear = getImperialYear(date);
                text = `${era}${imperialYear}`;
            } else if (props.calendar === CALENDAR_TYPES.GREGORIAN) {
               text =  yearText;
            }
        }

        // if (moment.locale() === 'ja') {
        //    text =  moment().year(yearText).toDate().toLocaleDateString(props.calendar, { year: 'numeric' });
        // } else {
        //    if (props.calendar === CALENDAR_TYPES.IMPERIAL)  {
        //        text = FORMAT.getYearText(yearText);
        //    } else {
        //        text = yearText;
        //    }
        // }

        return (
            <td
                role="link"
                tabIndex="1"
                key={yearText}
                className={classes.join(' ')}
                onClick={onClick}
                onKeyUp={onEnter(onClick)}
            >
                {text}
            </td>
        )
    },

    handleClick: function(props, date, event) {
        event.target.value = date;
        (props.onSelect || emptyFn)(date, event)
    }
});

DecadeView.getHeaderText = getDecadeViewHeaderText;

module.exports = DecadeView;
