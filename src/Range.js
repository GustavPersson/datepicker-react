import React from "react";
import moment from "moment";
import DayPicker from "./react-day-picker/DayPicker";
import DateUtils from "./react-day-picker/DateUtils";
import LocaleUtils from "./react-day-picker/LocaleUtils";

import "moment/locale/se";


export default class Range extends React.Component {

  state = {
    selectedDates: null
  };

  handleDayClick(e, day) {
    const collection = DateUtils.addDayToCollection(day.getTime(), this.state);
    this.setState(collection);
    console.log(this.state);
    console.log(collection);

  }

  handleResetClick(e) {
    e.preventDefault();
    this.setState({
      selectedDates: null
    });
  }

  handleWeekDayClick(e, weekday) {
    //const range = DateUtils.addDayToRange(weekday, this.state);
    //this.setState(range);
    console.log(weekday);
  }

  render() {
    const { selectedDates } = this.state;

    const modifiers = {
      selected: day => DateUtils.isDayInCollection(day, this.state)
    };

    return (
      <div className="RangeExample">

        { !selectedDates && <p>Please select a <strong>day</strong>.</p> }
        { selectedDates &&
          <p>You chose { selectedDates }. <a
              href="#" onClick={ this.handleResetClick.bind(this) }>Reset</a>
          </p>
        }

        <DayPicker
          ref="daypicker"
          numberOfMonths={ 2 }
          modifiers={ modifiers }
          onDayClick={ this.handleDayClick.bind(this) }
          onWeekDayClick={this.handleWeekDayClick.bind(this)}
          LocaleUtils={LocaleUtils}
          locale="se"
        />
      </div>
    );
  }

}
