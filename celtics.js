// celtics.js
// a very simple calendar picker
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
      
    tplCaption: {
      enumerable: true,
      writable: true,
      value: '<table cellspacing=0 cellpadding=0 class="d-caption">\
                <tr>\
                    <td><span id="d-m-y"></span></td>\
                    <td class="d-pointer"><span class="d-prev">&lt;</span><span class="d-next">&gt;</span></td>\
                </tr>\
             </table>'
     },
      
    tplTable: {
      enumerable: true,
      writable: true,
      value: '<table cellspacing=0 cellpadding=0 class="d-table" id="d-table">\
                <thead>\
                    <tr id="d-week"></tr>\
                </thead>\
                <tbody id="d-body"></tbody>\
              </table>'
      }
  });

  function $(selector) {
    var el = document.querySelectorAll(selector);
    return el.length > 1 ? el : el[0];
  }

  function Calendar(options) {
    var d = new Date;
    options || (options = {});
    if (!(this instanceof Calendar)) {
      return new Calendar(options);
    }
    this.year = d.getFullYear();
    this.month = d.getMonth();
    this.weekName = Calendar.language[options.lan || 'en'].weekName;
    this.monthName = Calendar.language[options.lan || 'en'].monthName;
    this.renderOnce = false;
    this.init();
  }
    
  o.proto = {
    constructor: Calendar,
    init: function() {
      var _this = this;
      this.setCurrentDate();
      $('.d-next').onclick = function() {
        _this.setNextDate();
      };
      $('.d-prev').onclick = function() {
        _this.setPrevDate();
      }
    },
      
    getDaysInMonth: function(year) {
      return [31, (o.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    },
      
    dateRender: function(year, month) {
      if (!this.renderOnce) {
        var td = [];
        var div = document.createElement('div');
        div.setAttribute('id', 'calendar-content');
        div.innerHTML = o.tplCaption + o.tplTable;
        document.body.appendChild(div);
        for (var i = 0; i < this.weekName.length; i++) {
          td.push('<th>' + this.weekName[i][0] + '</th>');
        }
        $('#d-week').innerHTML = td.join('');
        this.renderOnce = true;
      }
      var tr = [];
      var firstDay = new Date(year, month, 1).getDay();
      var prevFillDays = this.getDaysInMonth(year)[month ? month - 1 : 0] - (firstDay ? (firstDay - 1) : this.weekName.length - 1);
      var nextFillDays = 0,days = 0;
      for (var i = 0; i < this.weekName.length - 1; i++) {
        tr.push('<tr>');
        for (var j = 0; j < this.weekName.length; j++) {
          if (prevFillDays <= this.getDaysInMonth(year)[month ? month - 1 : 0]) {
            tr.push('<td class="d-off-month">' + prevFillDays + '</td>');
            prevFillDays++;
          } else {
            if (days < this.getDaysInMonth(year)[month]) {
              days++;
              var today = this.isToday(year, month, days) ? 'd-today' : '';
              tr.push('<td class="d-active-month ' + today + '">' + days + '</td>');
            } else {
              nextFillDays++;
              tr.push('<td class="d-off-month">' + nextFillDays + '</td>');
            }
          }
        }
        tr.push('</tr>');
      }
      $('#d-m-y').innerHTML = this.monthName[month] + ' ' + this.year;
      $('#d-body').innerHTML = tr.join('');
    },
      
    isToday: function(year, month, date) {
      var d = new Date;
      return year === d.getFullYear() && month === d.getMonth() && date === d.getDate();
    },
      
    setCurrentDate: function() {
      this.dateRender(this.year, this.month);
    },
      
    setPrevDate: function() {
      this.month -= 1;
      this.month < 0 && (this.year--, this.month = 11);
      this.dateRender(this.year, this.month);
    },
      
    setNextDate: function() {
      this.month += 1;
      this.month > 11 && (this.year++, this.month = 0);
      this.dateRender(this.year, this.month);
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
    
  if (!global.Calendar) {
    global.Calendar = Calendar;
  }
    
})(window);
