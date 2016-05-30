// a very simple datepicker
// month range `0-11`
(function(global) {
  'use strict';
  var o = Object.create(null, {
    isLeapYear: {
      enumerable: true,
      writable: true,
      value: function(year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
      }
    },
    tpl: {
      enumerable: true,
      writable: true,
      value: {
        tplCaption: 
          '<table cellspacing=0 cellpadding=0 class="d-caption">\
            <tr>\
              <td><span class="d-m-y"></span></td>\
              <td class="d-pointer"><span class="d-prev">&lt;</span><span class="d-next">&gt;</span></td>\
            </tr>\
          </table>',
        tplMain: 
          '<table cellspacing=0 cellpadding=0 class="d-table" id="d-table">\
            <thead>\
              <tr class="d-week"></tr>\
            </thead>\
            <tbody class="d-body"></tbody>\
          </table>'
      }
    }
  });

  function $(id) {
    return document.getElementById(id);
  }

  function q(id, selector) {
    var el = id.querySelectorAll(selector),
      len = el.length;
    return len > 1 ? el : el[0];
  }

  function extend(target, source) {
    for (var prop in source) {
      target[prop] = source[prop];
    }
    return target;
  }

  function Calendar(options) {
    var d = new Date;
    if (!(this instanceof Calendar)) {
      return new Calendar(options);
    }
    this.options = extend({}, options || (options = {}));
    this.year = this.options.year || d.getFullYear();
    this.month = this.options.month || d.getMonth();
    this.weekName = Calendar.language[options.lan || 'en'].weekName;
    this.monthName = Calendar.language[options.lan || 'en'].monthName;
    this.id = this.options.id || 'calendar-container';
    this.container = $(this.id);
    this.init();
  }
  o.proto = {
    constructor: Calendar,
    init: function() {
      var _this = this;
      if (this.container) return;
      this.addContainer();
      this.setCurrentDate();
      q(this.container, '.d-next').onclick = function() {
        _this.setNextDate();
      };
      q(this.container, '.d-prev').onclick = function() {
        _this.setPrevDate();
      };
    },
    
    getDaysInMonth: function(year) {
      return [31, (o.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    },
    
    addContainer: function() {
      var div = document.createElement('div');
      div.setAttribute('id', this.id);
      div.className = this.id;
      div.innerHTML = o.tpl.tplCaption + o.tpl.tplMain;
      document.body.appendChild(div);
      this.container = div;
      this.dateWeekRender();
    },
    
    dateWeekRender: function() {
      var td = [];
      for (var i = 0; i < this.weekName.length; i++) {
        td.push('<th>' + this.weekName[i][0] + '</th>');
      }
      q(this.container, '.d-week').innerHTML = td.join('');
    },
    
    isToday: function(year, month, date) {
      var d = new Date;
      return year === d.getFullYear() && month === d.getMonth() && date === d.getDate();
    },
    
    dateMonthDaysRender: function(year, month) {
      var tr = [];
      var firstDay = new Date(year, month, 1).getDay();
      var prevFillDays = this.getDaysInMonth(year)[month ? month - 1 : 0] - (firstDay ? (firstDay - 1) : this.weekName.length - 1);
      var nextFillDays = 0,
        days = 0;
      for (var i = 0; i < this.weekName.length - 1; i++) {
        tr.push('<tr>');
        for (var j = 0, len = this.weekName.length; j < len; j++) {
          if (prevFillDays <= this.getDaysInMonth(year)[month ? month - 1 : 0]) {
            tr.push('<td class="d-off-month">' + prevFillDays + '</td>');
            prevFillDays++;
          } else {
            if (days < this.getDaysInMonth(year)[month]) {
              days++;
              var today = this.isToday(year, month, days) ? ' d-today' : '';
              tr.push('<td class="d-active-month ' + today + '">' + days + '</td>');
            } else {
              nextFillDays++;
              tr.push('<td class="d-off-month">' + nextFillDays + '</td>');
            }
          }
        }
      }
      tr.push('</tr>');
      q(this.container, '.d-m-y').innerHTML = this.monthName[month] + ' ' + this.year;
      q(this.container, '.d-body').innerHTML = tr.join('');
    },
    
    setCurrentDate: function() {
      this.dateMonthDaysRender(this.year, this.month);
    },
    
    setPrevDate: function() {
      this.month -= 1;
      this.month < 0 && (this.year--, this.month = 11);
      this.setCurrentDate(this.year, this.month);
    },
    
    setNextDate: function() {
      this.month += 1;
      this.month > 11 && (this.year++, this.month = 0);
      this.setCurrentDate(this.year, this.month);
    }
  };
  Calendar.prototype = o.proto;
  
  Calendar.language = {
    'en': {
      weekName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      monthName: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    'de': {
      weekName: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      monthName: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    },
    'fr': {
      weekName: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      monthName: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    },
    'it': {
      weekName: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
      monthName: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
    }
  };
    
  // transport
  if (!global.Calendar) {
    global.Calendar = Calendar;
  }
    
})(window);
