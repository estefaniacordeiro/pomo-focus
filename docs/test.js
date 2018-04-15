const moment = require('moment');

// console.log(moment(1522265421002).format("MMDDYYYY"));
const date1 = '05 Apr 2018 18:02:00 GMT';
const date2 = '05 Apr 2018 12:10:00 GMT';

const minus = Date.parse(date2) - Date.parse(date1);


// const someDate = +new Date();
// console.log(moment(1522916700000).format('HH:MM'));
// console.log(minus / 1000 / 60);

// const now = Date.now();
// const now2 = moment();
// console.log(now);
// console.log(moment(date1).isUtc());

// const test = moment(1523028300000 - 25 * 60 * 1000);

// console.log(test.toString());

console.log(moment('2018-04-11').add(1, 'd').format('YYYY-MM-DD'));
