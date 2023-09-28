import moment from 'moment';

export const assignAndGetDate = async (date, days, hours, minutes, seconds) => {
  await assignDate(date, days, hours, minutes, seconds);
};

export const assignDate = (date, days, hours, minutes, seconds, doLog = true) => {
  date = new Date();
  days = new Date().getDate();
  hours = new Date().getHours();
  minutes = new Date().getMinutes();
  seconds = new Date().getSeconds();
  if (doLog) {
    getDateCurrent(date, days, hours, minutes, seconds);
  }
};

export const getDateCurrent = (date, days, hours, minutes, seconds) => {
  console.log(
    'CURRENT DATE --> date: %o day: %o hours: %o minutes: %o seconds: %o',
    moment().format('YYYY-MM-DD hh:mm:ss'),
    days,
    hours,
    minutes,
    seconds,
  );
};
