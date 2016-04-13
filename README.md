# datepicker-react

This is a datepicker built in react, built on top of [React-day-picker](http://www.gpbl.org/react-day-picker/).

It supports selecting dates by clicking and/or dragging on the week number, the day of the week and individual dates.

It almost suports growing the calendar vertically to add in more months, but that feature is not yet complete. You can view a
work in progress by toggling the `renderMonthsVertically`-prop to true, and increase the `numberOfMonths`-prop to more than 1.

When that is done, the calendar will draw the number of requested months vertically, but there will be duplicate days and weeks
when the months change, because I didn't change that draw logic from react-day-picker yet.

# Running
To start, just clone, run `npm install` and `npm start`, then navigate to http://localhost:3030.
