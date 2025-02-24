import moment from 'moment-hijri';

export function formatDateToHijriAndGregorian(date: Date, key?: 'gregorian') {
  moment.locale('en'); // Set the default locale to English cus the default is Arabic
  if (key === 'gregorian') {
    return moment(date).format('YYYY-MM-DD');
  }
  return moment(date).format('iYYYY-iMM-iDD');
}
