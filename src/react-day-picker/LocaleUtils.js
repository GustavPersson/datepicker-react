const WEEKDAYS_LONG = ["Monday", "Tuesday",
  "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WEEKDAYS_SHORT = ["Mo", "Tu",
  "We", "Th", "Fr", "Sa", "Su"];

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

export function formatMonthTitle(d) {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatWeekdayShort(i) {
  return WEEKDAYS_SHORT[i];
}

export function formatWeekdayLong(i) {
  return WEEKDAYS_LONG[i];
}

export function getFirstDayOfWeek() {
  return 1;
}

export function getMonths() {
  return MONTHS;
}

export default {
  formatMonthTitle,
  formatWeekdayShort,
  formatWeekdayLong,
  getFirstDayOfWeek,
  getMonths
}
