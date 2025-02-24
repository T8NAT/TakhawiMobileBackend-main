export const convertDateToKSA = (date: Date): string => {
  const convertedDate = new Date(date);
  convertedDate.setHours(convertedDate.getHours() + 3);
  return convertedDate.toISOString();
};
// const ksaDate = new Date().toLocaleString('en-US', {
//   timeZone: 'Asia/Riyadh',
// });
