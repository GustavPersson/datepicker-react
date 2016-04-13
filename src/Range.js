import React from "react";
import moment from "moment";
import DayPicker from "./react-day-picker/DayPicker";
import DateUtils from "./react-day-picker/DateUtils";
import LocaleUtils from "./react-day-picker/LocaleUtils";
import Helpers from "./react-day-picker/Helpers";

import "moment/locale/se";

export default class Range extends React.Component {

  state = {
    selectedDates: [],
    selectedWeeks: [],
    selectedWeekDays: [],
    numberOfMonths: 1
  };

  handleDayClick(e, day, modifiers) {
    let state = this.state;

    if ((this.state.selectedWeekDays.length > 0 || this.state.selectedWeeks.length > 0) && DateUtils.isDayInCollection(day, state)) {
      state.selectedWeeks = [];
      state.selectedDates = [];
      state.selectedWeekDays = [];

      state = DateUtils.addDayToCollection(day.getTime(), state);
    } else if (this.state.selectedWeekDays.length > 0) {

      state.selectedWeeks = [];
      state.selectedDates = [];
      state.selectedWeekDays = [];


      const firstDayOfMonth = Helpers.getFirstDayOfMonth(day);
      state = DateUtils.addWeekDaysToCollection(moment(day).weekday(), firstDayOfMonth, state);

    } else if (this.state.selectedWeeks.length > 0) {
      state.selectedWeeks = [];
      state.selectedDates = [];
      state.selectedWeekDays = [];

      const weekNumber = moment(day).week();
      const weeksInMonth = Helpers.getWeekArray(day);
      let firstDayOfWeek;

      for (let i = 0; i < weeksInMonth.length; i++) {
        if (moment(weeksInMonth[i][0]).week() === weekNumber) {
          firstDayOfWeek = weeksInMonth[i][0];
          break;
        }
      }

      state = DateUtils.addWeekToCollection(weekNumber, firstDayOfWeek, state);

    } else {
      state = DateUtils.addDayToCollection(day.getTime(), state);
    }

    this.setState(state);
  }

  handleDayDrag(e, start, end) {

  }

  handleDayMouseDown(e, day, modifiers) {
    this.handleDayClick(e, day, modifiers);
  }

  handleDayMouseUp(e, day, modifiers) {

  }

  handleDayMouseEnter(e, day, modifiers, dragging) {
    if (dragging) {
      let state = this.state;
      state = DateUtils.addDayToCollection(day.getTime(), state);
      this.setState(state);
    }
  }
  handleWeekDayMouseDown(e, weekday, weekdayModifiers) {
    this.handleWeekDayClick(e, weekday, weekdayModifiers);
  }

  handleWeekDayMouseUp(e, weekday, weekdayModifiers) {

  }

  handleWeekDayMouseEnter(e, weekday, weekdayModifiers, dragging) {
    if (dragging) {
      this.handleWeekDayClick(e, weekday, weekdayModifiers);
    }
  }

  handleResetClick(e) {
    e.preventDefault();
    this.resetState();
  }

  handleWeekDayClick(e, weekday, firstDayOfMonth, modifiers) {
    let state = this.state;

    if (state.selectedWeekDays.indexOf(weekday) < 0) {
      state = DateUtils.addWeekDaysToCollection(weekday, firstDayOfMonth, state);
    } else {
      state = DateUtils.removeWeekDaysFromCollection(weekday, firstDayOfMonth, state);
    }

    this.setState(state);
  }

  handleWeekDayDrag(e, start, end, firstDayOfMonth) {
    let state = this.state;

    if (start > end) {
      //switch place of start and end because user dragged backwards
      const tempStart = start;
      start = end;
      end = tempStart;
    }

    for (let weekday = start; weekday <= end; weekday++) {
      if (state.selectedWeekDays.indexOf(weekday) < 0) {
        state = DateUtils.addWeekDaysToCollection(weekday, firstDayOfMonth, state);
      } else {
        state = DateUtils.removeWeekDaysFromCollection(weekday, firstDayOfMonth, state);
      }
    }

    this.setState(state);
  }

  handleWeekNumberMouseDown(e, weekNumber, firstDayOfWeek) {
    this.handleWeekNumberClick(e, weekNumber, firstDayOfWeek);
  }

  handleWeekNumberMouseUp(e, weekNumber, firstDayOfWeek) {

  }
  handleWeekNumberMouseEnter(e, weekNumber, firstDayOfWeek, weekNumberDragging) {
    if (weekNumberDragging) {
      this.handleWeekNumberClick(e, weekNumber, firstDayOfWeek);
    }
  }

  handleWeekNumberClick(e, weekNumber, firstDayOfWeek) {
    let state = this.state;

    if (state.selectedWeeks.indexOf(weekNumber) < 0) {
      state = DateUtils.addWeekToCollection(weekNumber, firstDayOfWeek, state);
    } else {
      state = DateUtils.removeWeekFromCollection(weekNumber, firstDayOfWeek, state);
    }

    this.setState(state);
  }

  resetState() {
    this.setState({
      selectedDates: [],
      selectedWeeks: [],
      selectedWeekDays: []
    });
  }

  renderSelectedDay(day) {
    return(
      <div>
        {moment(day).format("L")}
      </div>
    );
  }

  render() {
    const { selectedDates } = this.state;

    const modifiers = {
      selected: day => DateUtils.isDayInCollection(day, this.state)
    };

    const weekdayModifiers = {
      weekdaySelected: weekday => DateUtils.isWeekdayInCollection(weekday, this.state)
    };

    const weekNumberModifiers = {
      selected: weekNumber => DateUtils.isWeekInCollection(weekNumber, this.state)
    };

    return (
      <div className="RangeExample">

        <DayPicker
          ref="daypicker"
          numberOfMonths = { this.state.numberOfMonths }
          renderMonthsVertically = { true }
          modifiers = { modifiers }
          enableOutsideDays = { true }
          weekdayModifiers = { weekdayModifiers }
          weekNumberModifiers = {weekNumberModifiers}
          onDayMouseDown = {this.handleDayMouseDown.bind(this)}
          onDayMouseUp = {this.handleDayMouseUp.bind(this) }
          onDayMouseEnter = {this.handleDayMouseEnter.bind(this)}
          onWeekDayMouseDown = {this.handleWeekDayMouseDown.bind(this)}
          onWeekDayMouseUp = {this.handleWeekDayMouseUp.bind(this) }
          onWeekDayMouseEnter = {this.handleWeekDayMouseEnter.bind(this)}
          onWeekNumberMouseDown = {this.handleWeekNumberMouseDown.bind(this)}
          onWeekNumberMouseUp = {this.handleWeekNumberMouseUp.bind(this)}
          onWeekNumberMouseEnter = {this.handleWeekNumberMouseEnter.bind(this)}
          LocaleUtils = {LocaleUtils}
          locale="se"
        />

        { !selectedDates && <p>Please select a <strong>day</strong>.</p> }
        { selectedDates &&
          <p>You chose the following dates: </p>
        }
        <div> { selectedDates.map(day => this.renderSelectedDay(day)) } </div>

        <a href="#" onClick={ this.handleResetClick.bind(this) }>Reset</a>

      </div>
    );
  }

}
