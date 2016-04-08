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
    selectedWeekDays: []
  };

  handleDayClick(e, day) {
    let collection = null;

    if (this.state.selectedWeekDays.length > 0 && DateUtils.isDayInCollection(day, this.state)) {
      this.state = {
        selectedDates: [],
        selectedWeeks: [],
        selectedWeekDays: []
      };

      collection = DateUtils.addDayToCollection(day.getTime(), this.state);
    } else if (this.state.selectedWeekDays.length > 0) {
      this.state = {
        selectedDates: [],
        selectedWeeks: [],
        selectedWeekDays: []
      };

      const firstDayOfMonth = Helpers.getFirstDayOfMonth(day);
      collection = DateUtils.addWeekDaysToCollection(moment(day).weekday(), firstDayOfMonth, this.state);
    } else {
      collection = DateUtils.addDayToCollection(day.getTime(), this.state);
    }

    this.setState(collection);
  }

  handleResetClick(e) {
    e.preventDefault();
    this.setState({
      selectedDates: [],
      selectedWeeks: [],
      selectedWeekDays: []
    });
  }

  handleWeekDayClick(e, weekday, firstDayOfMonth, modifiers) {
    let range;

    if (this.state.selectedWeekDays.indexOf(weekday) < 0) {
      range = DateUtils.addWeekDaysToCollection(weekday, firstDayOfMonth, this.state);
    } else {
      range = DateUtils.removeWeekDaysFromCollection(weekday, firstDayOfMonth, this.state);
    }

    this.setState(range);
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

    return (
      <div className="RangeExample">

        <DayPicker
          ref="daypicker"
          numberOfMonths={ 1 }
          modifiers={ modifiers }
          weekdayModifiers = { weekdayModifiers }
          onDayClick={ this.handleDayClick.bind(this) }
          onWeekDayClick={this.handleWeekDayClick.bind(this)}
          LocaleUtils={LocaleUtils}
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
