const path = require('path');


module.exports = function (hbs) {
//register partials
  hbs.registerHelper("formatDate", function (datetime) {
    return `${datetime.getUTCDate()}/${datetime.getUTCMonth() + 1}/${datetime.getFullYear()}`;
  });
  hbs.registerHelper("formatHours", function (datetime) {

    return `${datetime.getUTCHours()}:${datetime.getMinutes()<10?'0' + datetime.getMinutes(): datetime.getMinutes()}`;
  });

};