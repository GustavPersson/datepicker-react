import moment from "moment";

/**
 * Return `d` as a new date with `n` months added.
 * @param {[type]} d
 * @param {[type]} n
 */
export function addMonths(d, n) {
  const newDate = clone(d);
  newDate.setMonth(d.getMonth() + n);
  return newDate;
}

/**
 * Clone a date object.
 *
 * @param  {Date} d The date to clone
 * @return {Date} The cloned date
 */
export function clone(d) {
  return new Date(d.getTime());
}

/**
 * Return `true` if two dates are the same day, ignoring the time.
 *
 * @param  {Date}  d1
 * @param  {Date}  d2
 * @return {Boolean}
 */
export function isSameDay(d1, d2) {
  if (!d1 || !d2) {
    return false;
  }
  return d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
}

/**
 * Return `true` if a day is in the past, e.g. yesterday or any day
 * before yesterday.
 *
 * @param  {Date}  d
 * @return {Boolean}
 */
export function isPastDay(d) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

/**
 * Return `true` if day `d` is between days `d1` and `d2`,
 * without including them.
 *
 * @param  {Date}  d
 * @param  {Date}  d1
 * @param  {Date}  d2
 * @return {Boolean}
 */
export function isDayBetween(d, d1, d2) {
  d = clone(d);
  d1 = clone(d1);
  d2 = clone(d2);

  d.setHours(0, 0, 0, 0);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return (d1 < d && d < d2) || (d2 < d && d < d1);
}

/**
 * Add a day to a range and return a new range. A range is an object with
 * `from` and `to` days.
 *
 * @param {Date} day
 * @param {Object} range
 * @return {Object} Returns a new range object
 */
export function addDayToRange(day, range={from: null, to: null}) {
  let { from, to } = range;
  if (!from) {
    from = day;
  }
  else if (from && to && isSameDay(from, to) && isSameDay(day, from)) {
    from = null;
    to = null;
  }
  else if (to && day < from) {
    from = day;
  }
  else if (to && isSameDay(day, to)) {
    from = day;
    to = day;
  }
  else {
    to = day;
    if (to < from) {
      to = from;
      from = day;
    }
  }

  return { from, to };
}

/**
 * Return `true` if a day is included in a range of days.
 *
 * @param  {Date}  day
 * @param  {Object}  range
 * @return {Boolean}
 */
export function isDayInRange(day, range) {
  const { from, to } = range;
  return (from && isSameDay(day, from)) ||
    (to && isSameDay(day, to)) ||
    (from && to && isDayBetween(day, from, to));
}

export function addDayToCollection(day, collection={selectedDates: []}) {
  const myCollection = collection;

  if(!myCollection.selectedDates) {
    myCollection.selectedDates = [day];
  } else if (myCollection.selectedDates.indexOf(day) < 0) {
    myCollection.selectedDates.push(day);
  } else if (myCollection.selectedDates.indexOf(day) > -1) {
    myCollection.selectedDates.splice(myCollection.selectedDates.indexOf(day), 1);
  }
  return myCollection;
}

export function isDayInCollection(day, collection) {
  return collection.selectedDates.indexOf(day.getTime()) > -1;
}

export function addWeekDaysToCollection(weekday, firstDayOfMonth, collection={selectedDates: []}) {
  const d = new Date(firstDayOfMonth),
    month = d.getMonth(),
    myCollection = collection;

  d.setDate(1);

  // Get the first Monday in the month, use moment to avoid that sunday is 0
  while (moment(d).weekday() !== weekday) {
    d.setDate(d.getDate() + 1);
  }

  // Get all the other Mondays in the month
  while (d.getMonth() === month) {
    myCollection.selectedDates.push(d.getTime());
    d.setDate(d.getDate() + 7);
  }

  myCollection.selectedWeekDays.push(weekday);

  return myCollection;
}

export function isWeekdayInCollection(weekday, collection) {
  return collection.selectedWeekDays.indexOf(weekday) > -1;
}

export function removeWeekDaysFromCollection(weekday, firstDayOfMonth, collection={selectedDates: []}) {
  const d = new Date(firstDayOfMonth),
    month = d.getMonth(),
    myCollection = collection;

  d.setDate(1);

  // Get the first Monday in the month, use moment to avoid that sunday is 0
  while (moment(d).weekday() !== weekday) {
    d.setDate(d.getDate() + 1);
  }

  // Get all the other Mondays in the month
  while (d.getMonth() === month) {
    const selectedDateIndex = myCollection.selectedDates.indexOf(d.getTime());
    myCollection.selectedDates.splice(selectedDateIndex, 1);
    d.setDate(d.getDate() + 7);
  }

  const weekdayIndex = myCollection.selectedWeekDays.indexOf(weekday);
  myCollection.selectedWeekDays.splice(weekdayIndex, 1);

  return myCollection;
}

export function addWeekToCollection(week, firstDayOfWeek, collection) {
  let myCollection = collection;
  const day = new Date(moment(firstDayOfWeek));

  for (let i = 0; i < 7; i++) {
    if (myCollection.selectedDates.indexOf(day.getTime()) < 0) {
      myCollection.selectedDates.push(day.getTime());
    }
    day.setDate(day.getDate() + 1);
  }

  myCollection.selectedWeeks.push(week);

  return myCollection;
}


export function removeWeekFromCollection(week, firstDayOfWeek, collection) {
  let myCollection = collection;
  const day = new Date(moment(firstDayOfWeek));

  for (let i = 0; i < 7; i++) {
    const dateIndex = myCollection.selectedDates.indexOf(day.getTime());
    myCollection.selectedDates.splice(dateIndex, 1);
    day.setDate(day.getDate() + 1);
  }

  myCollection.selectedWeeks.splice(myCollection.selectedWeeks.indexOf(week), 1);

  return myCollection;
}

export default {
  addDayToRange,
  addDayToCollection,
  addWeekDaysToCollection,
  addMonths,
  clone,
  isSameDay,
  isDayInRange,
  isDayInCollection,
  isDayBetween,
  isPastDay,
  isWeekdayInCollection,
  removeWeekDaysFromCollection,
  addWeekToCollection,
  removeWeekFromCollection
}
