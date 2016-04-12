import React, { Component, PropTypes } from "react";
import * as Helpers from "./Helpers";
import * as DateUtils from "./DateUtils";
import * as LocaleUtils from "./LocaleUtils";
import moment from "moment";

const keys = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  ENTER: 13,
  SPACE: 32
};

class Caption extends Component {

  render() {
    const { date, locale, localeUtils, onClick } = this.props;
    return (
      <div className="DayPicker-Caption" onClick={ onClick }>
        { localeUtils.formatMonthTitle(date, locale) }
      </div>
    );
  }
}

export default class DayPicker extends Component {

  static propTypes = {
    tabIndex: PropTypes.number,
    initialMonth: PropTypes.instanceOf(Date),
    numberOfMonths: PropTypes.number,

    modifiers: PropTypes.object,
    weekdayModifiers: PropTypes.object,
    weekNumberModifiers: PropTypes.object,

    locale: PropTypes.string,
    localeUtils: PropTypes.shape({
      formatMonthTitle: PropTypes.func,
      formatWeekdayShort: PropTypes.func,
      formatWeekdayLong: PropTypes.func,
      getFirstDayOfWeek: PropTypes.func
    }),

    enableOutsideDays: PropTypes.bool,
    canChangeMonth: PropTypes.bool,
    reverseMonths: PropTypes.bool,
    fromMonth: PropTypes.instanceOf(Date),
    toMonth: PropTypes.instanceOf(Date),

    onDayClick: PropTypes.func,
    onDayTouchTap: PropTypes.func,
    onDayMouseEnter: PropTypes.func,
    onDayMouseLeave: PropTypes.func,
    onMonthChange: PropTypes.func,
    onCaptionClick: PropTypes.func,

    onDayMouseDown: PropTypes.func,
    onDayMouseUp: PropTypes.func,
    onWeekDayClick: PropTypes.func,

    onWeekNumberClick: PropTypes.func,
    onWeekNumberMouseDown: PropTypes.func,
    onWeekNumberMouseUp: PropTypes.func,
    onWeekNumberMouseEnter: PropTypes.func,

    onWeekDayMouseEnter: PropTypes.func,
    onWeekDayMouseDown: PropTypes.func,
    onWeekDayMouseUp: PropTypes.func,

    onWeekDayDrag: PropTypes.func,
    onDayDrag: PropTypes.func,

    renderDay: PropTypes.func,

    captionElement: PropTypes.element
  };

  static defaultProps = {
    tabIndex: 0,
    initialMonth: new Date(),
    numberOfMonths: 1,
    locale: "en",
    localeUtils: LocaleUtils,
    enableOutsideDays: false,
    canChangeMonth: true,
    reverseMonths: false,
    renderDay: day => day.getDate(),
    captionElement: <Caption />
  };

  constructor(props) {
    super(props);
    this.state = {
      currentMonth: Helpers.startOfMonth(props.initialMonth)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initialMonth !== nextProps.initialMonth) {
      this.setState({
        currentMonth: Helpers.startOfMonth(nextProps.initialMonth)
      });
    }
  }

  allowPreviousMonth() {
    const previousMonth = DateUtils.addMonths(this.state.currentMonth, -1)
    return this.allowMonth(previousMonth);
  }

  allowNextMonth() {
    const nextMonth = DateUtils.addMonths(this.state.currentMonth, this.props.numberOfMonths);
    return this.allowMonth(nextMonth);
  }

  allowMonth(d) {
    const { fromMonth, toMonth } = this.props;
    if ((fromMonth && Helpers.getMonthsDiff(fromMonth, d) < 0) ||
      (toMonth && Helpers.getMonthsDiff(toMonth, d) > 0)) {
      return false;
    }
    return true;
  }

  showMonth(d, callback) {
    if (!this.allowMonth(d)) {
      return;
    }

    this.setState({
      currentMonth: Helpers.startOfMonth(d)
    }, callback);
  }

  showMonthAndCallHandler(d, callback) {
    this.showMonth(d, () => {
      if (callback) {
        callback();
      }
      if (this.props.onMonthChange) {
        this.props.onMonthChange(this.state.currentMonth);
      }
    });
  }

  showNextMonth(callback) {
    if (this.allowNextMonth()) {
      const nextMonth = DateUtils.addMonths(this.state.currentMonth, 1);
      this.showMonthAndCallHandler(nextMonth, callback);
    }
  }

  showPreviousMonth(callback) {
    if (this.allowPreviousMonth()) {
      const previousMonth = DateUtils.addMonths(this.state.currentMonth, -1);
      this.showMonthAndCallHandler(previousMonth, callback);
    }
  }

  showNextYear(callback) {
    const nextMonth = DateUtils.addMonths(this.state.currentMonth, 12);
    this.showMonthAndCallHandler(nextMonth, callback);
  }

  showPreviousYear(callback) {
    const nextMonth = DateUtils.addMonths(this.state.currentMonth, -12);
    this.showMonthAndCallHandler(nextMonth, callback);
  }

  getDayNodes() {
    return this.refs.dayPicker.querySelectorAll(".DayPicker-Day:not(.DayPicker-Day--outside)");
  }

  getDayNodeIndex(dayNode, dayNodes) {
    for (let i = 0; i < dayNodes.length; i++) {
      if (dayNodes[i] === dayNode) {
        return i;
      }
    }

    return -1;
  }

  focusFirstDayOfMonth() {
    this.getDayNodes()[0].focus();
  }

  focusLastDayOfMonth() {
    const dayNodes = this.getDayNodes();
    dayNodes[dayNodes.length - 1].focus();
  }

  focusPreviousDay(dayNode) {
    const dayNodes = this.getDayNodes();
    const dayNodeIndex = this.getDayNodeIndex(dayNode, dayNodes);

    if (dayNodeIndex === 0) {
      this.showPreviousMonth(() => { this.focusLastDayOfMonth() })
    }
    else {
      dayNodes[dayNodeIndex - 1].focus();
    }
  }

  focusNextDay(dayNode) {
    const dayNodes = this.getDayNodes();
    const dayNodeIndex = this.getDayNodeIndex(dayNode, dayNodes);

    if (dayNodeIndex === dayNodes.length - 1) {
      this.showNextMonth(() => { this.focusFirstDayOfMonth() });
    }
    else {
      dayNodes[dayNodeIndex + 1].focus();
    }
  }

  focusNextWeek(dayNode) {
    const dayNodes = this.getDayNodes();
    const dayNodeIndex = this.getDayNodeIndex(dayNode, dayNodes);
    const isInLastWeekOfMonth = dayNodeIndex > dayNodes.length - 8;

    if (isInLastWeekOfMonth) {
      this.showNextMonth(() => {
        const daysAfterIndex = dayNodes.length - dayNodeIndex;
        const nextMonthDayNodeIndex = 7 - daysAfterIndex;
        this.getDayNodes()[nextMonthDayNodeIndex].focus();
      });
    }
    else {
      dayNodes[dayNodeIndex + 7].focus();
    }
  }

  focusPreviousWeek(dayNode) {
    const dayNodes = this.getDayNodes();
    const dayNodeIndex = this.getDayNodeIndex(dayNode, dayNodes);
    const isInFirstWeekOfMonth = dayNodeIndex <= 6;

    if (isInFirstWeekOfMonth) {
      this.showPreviousMonth(() => {
        const previousMonthDayNodes = this.getDayNodes();
        const startOfLastWeekOfMonth = previousMonthDayNodes.length - 7;
        const previousMonthDayNodeIndex = startOfLastWeekOfMonth + dayNodeIndex;
        previousMonthDayNodes[previousMonthDayNodeIndex].focus();
      });
    }
    else {
      dayNodes[dayNodeIndex - 7].focus();
    }
  }

  // Event handlers

  handleKeyDown(e) {
    e.persist();
    const { canChangeMonth, onKeyDown } = this.props;

    if (!canChangeMonth && onKeyDown) {
      onKeyDown(e);
      return;
    }

    if (canChangeMonth) {
      switch (e.keyCode) {
      case keys.LEFT:
        this.showPreviousMonth(onKeyDown);
        break;
      case keys.RIGHT:
        this.showNextMonth(onKeyDown);
        break;
      case keys.UP:
        this.showPreviousYear(onKeyDown);
        break;
      case keys.DOWN:
        this.showNextYear(onKeyDown);
        break;
      default:
        if (onKeyDown) {
          onKeyDown(e);
        }
      }
    }
  }

  handleDayKeyDown(e, day, modifiers) {
    e.persist();
    switch (e.keyCode) {
    case keys.LEFT:
      Helpers.cancelEvent(e);
      this.focusPreviousDay(e.target);
      break;
    case keys.RIGHT:
      Helpers.cancelEvent(e);
      this.focusNextDay(e.target);
      break;
    case keys.UP:
      Helpers.cancelEvent(e);
      this.focusPreviousWeek(e.target);
      break;
    case keys.DOWN:
      Helpers.cancelEvent(e);
      this.focusNextWeek(e.target);
      break;
    case keys.ENTER:
    case keys.SPACE:
      Helpers.cancelEvent(e);
      if (this.props.onDayClick) {
        this.handleDayClick(e, day, modifiers);
      }
      if (this.props.onDayTouchTap) {
        this.handleDayTouchTap(e, day, modifiers);
      }
      break;
    }
  }

  handleNextMonthClick() {
    this.showNextMonth();
  }

  handlePrevMonthClick() {
    this.showPreviousMonth();
  }

  handleCaptionClick(e, currentMonth) {
    e.persist();
    this.props.onCaptionClick(e, currentMonth);
  }

  handleDayMouseDown(e, day, modifiers) {
    e.persist();
    if (modifiers.indexOf("outside") > -1) {
      //this.handleOutsideDayPress(day);
    }
    this.state.draggingDay = true;

    this.props.onDayMouseDown(e, day, modifiers);
  }

  handleDayMouseUp(e, day, modifiers) {
    e.persist();
    if (modifiers.indexOf("outside") > -1) {
      //this.handleOutsideDayPress(day);
    }
    this.state.draggingDay = false;

    this.props.onDayMouseUp(e, day, modifiers);
  }

  handleWeekDayMouseDown(e, weekday, weekdayModifiers) {
    e.persist();

    this.state.weekDayDragging = true;
    this.props.onWeekDayMouseDown(e, weekday, weekdayModifiers);
  }

  handleWeekDayMouseUp(e, weekday, weekdayModifiers) {
    e.persist();
    this.state.weekDayDragging = false;

    this.props.onWeekDayMouseUp(e, weekday, weekdayModifiers);
  }

  handleWeekDayClick(e, weekday, weekdayModifiers) {
    e.persist();
    this.props.onWeekDayClick(e, weekday, weekdayModifiers);
  }

  handleWeekDayMouseEnter(e, day, modifiers) {
    e.persist();

    this.props.onWeekDayMouseEnter(e, day, modifiers, this.state.weekDayDragging);
  }

  handleWeekDayMouseLeave(e, day, modifiers) {
    e.persist();
    this.props.onDayMouseLeave(e, day, modifiers);
  }


  handleWeekNumberMouseDown(e, weekNumber, firstDayOfWeek) {
    e.persist();
    this.state.weekNumberDragging = true;

    this.props.onWeekNumberMouseDown(e, weekNumber, firstDayOfWeek);
  }

  handleWeekNumberMouseUp(e, weekNumber, firstDayOfWeek) {
    e.persist();
    this.state.weekNumberDragging = false;

    this.props.onWeekNumberMouseUp(e, weekNumber, firstDayOfWeek);
  }

  handleWeekNumberMouseEnter(e, weekNumber, firstDayOfWeek) {
    e.persist();
    this.props.onWeekNumberMouseEnter(e, weekNumber, firstDayOfWeek, this.state.weekNumberDragging);
  }

  handleDayTouchTap(e, day, modifiers) {
    e.persist();
    if (modifiers.indexOf("outside") > -1) {
      this.handleOutsideDayPress(day);
    }
    this.props.onDayTouchTap(e, day, modifiers);
  }

  handleDayClick(e, day, modifiers) {
    e.persist();
    if (modifiers.indexOf("outside") > -1) {
      this.handleOutsideDayPress(day);
    }

    this.props.onDayClick(e, day, modifiers);
  }

  handleDayMouseEnter(e, day, modifiers) {
    e.persist();

    this.props.onDayMouseEnter(e, day, modifiers, this.state.draggingDay);
  }

  handleDayMouseLeave(e, day, modifiers) {
    e.persist();
    this.props.onDayMouseLeave(e, day, modifiers);
  }

  handleOutsideDayPress(day) {
    const { currentMonth } = this.state;
    const { numberOfMonths } = this.props;
    const diffInMonths = Helpers.getMonthsDiff(currentMonth, day);
    if (diffInMonths > 0 && diffInMonths >= numberOfMonths) {
      this.showNextMonth();
    }
    else if (diffInMonths < 0) {
      this.showPreviousMonth();
    }
  }

  handleMouseLeave() {
    console.log(this.state);
    this.state.weekDayDragging = false;
    this.state.draggingDay = false;
  }

  renderNavBar() {
    const baseClass = "DayPicker-NavButton DayPicker-NavButton";
    const isRTL = this.props.dir === "rtl";

    const leftButton = isRTL ? this.allowNextMonth() : this.allowPreviousMonth();
    const rightButton = isRTL ? this.allowPreviousMonth() : this.allowNextMonth();

    return (
      <div className="DayPicker-NavBar">
        { leftButton &&
          <span
            key="left"
            className={ `${baseClass}--prev` }
            onClick={ isRTL ? ::this.handleNextMonthClick : ::this.handlePrevMonthClick }
          />
        }
        { rightButton &&
          <span
            key="right"
            className={ `${baseClass}--next` }
            onClick={  isRTL ? ::this.handlePrevMonthClick : ::this.handleNextMonthClick }
          />
        }
      </div>
    );
  }

  renderMonth(date, i) {
    const { locale, localeUtils, onCaptionClick, captionElement } = this.props;

    const caption = React.cloneElement(captionElement, {
      date, localeUtils, locale,
      onClick: onCaptionClick ? e => this.handleCaptionClick(e, date) : null
    });

    return (
      <div
        className="DayPicker-Month"
        key={ i }>

        { caption }

        <div className="DayPicker-Weekdays" role="rowgroup">
          <div className="DayPicker-WeekdaysRow" role="columnheader">
            { this.renderWeekDays(date) }
          </div>
        </div>
        <div className="DayPicker-Body" role="rowgroup">
          { this.renderWeeksInMonth(date) }
        </div>
      </div>
    );
  }

  renderWeekDays(date, i) {
    const { locale, localeUtils, onWeekDayClick, onWeekDayMouseDown,onWeekDayMouseUp,onWeekDayMouseEnter, weekdayModifiers } = this.props;
    const days = [<div className = "DayPicker-Weekday-Weeknumber">WK</div>];

    for (let i = 0; i < 7; i++) {
      let modifiers = [];

      let className = "DayPicker-Weekday";

      const selected = weekdayModifiers.weekdaySelected(i);

      if (selected) {
        modifiers.push("selected");
      }

      className += modifiers.map(modifier => ` ${className}--${modifier}`).join("");

      days.push(
        <div key={ i }
          onClick= { onWeekDayClick ?
            (e) => this.handleWeekDayClick(e, i, date, modifiers) : null }
          onMouseDown= { onWeekDayMouseDown ?
            (e) => this.handleWeekDayMouseDown(e, i, date, modifiers) : null }
          onMouseUp= { onWeekDayMouseUp ?
            (e) => this.handleWeekDayMouseUp(e, i, date, modifiers) : null }
          onMouseEnter = { onWeekDayMouseEnter ?
            (e) => this.handleWeekDayMouseEnter(e, i, date, modifiers) : null }
          className = {className}
        >
          <abbr title={ localeUtils.formatWeekdayLong(i, locale) }>
            { !selected && localeUtils.formatWeekdayShort(i, locale) }
            { selected && ""}
          </abbr>
        </div>
      );
    }
    return days;
  }

  renderWeeksInMonth(month) {
    const { locale, localeUtils, onWeekNumberMouseDown, onWeekNumberMouseUp, onWeekNumberMouseEnter, weekNumberModifiers } = this.props;
    const firstDayOfWeek = localeUtils.getFirstDayOfWeek(locale);

    const className = "DayPicker-Week-Number";


    return Helpers.getWeekArray(month, firstDayOfWeek).map((week, i) =>
      <div key={ i } className="DayPicker-Week" role="row">
        <div
        className= {weekNumberModifiers.selected(moment(week[0]).week()) ? className + " DayPicker-Week-Number--selected" : "DayPicker-Week-Number"}
        onMouseDown= { onWeekNumberMouseDown ?
          (e) => this.handleWeekNumberMouseDown(e, moment(week[0]).week(), week[0]) : null }
        onMouseUp= { onWeekNumberMouseUp ?
          (e) => this.handleWeekNumberMouseUp(e, moment(week[0]).week(), week[0]) : null }
        onMouseEnter = { onWeekNumberMouseEnter ?
          (e) => this.handleWeekNumberMouseEnter(e, moment(week[0]).week(), week[0]) : null }
        >
          {moment(week[0]).week()}
        </div>
        { week.map(day => this.renderDay(month, day)) }
      </div>
    );
  }

  renderDay(month, day) {

    const { enableOutsideDays, modifiers: modifierFunctions } = this.props;

    let className = "DayPicker-Day";
    let modifiers = [];
    const key = `${day.getFullYear()}${day.getMonth()}${day.getDate()}`;

    const isToday = DateUtils.isSameDay(day, new Date());
    if (isToday) {
      modifiers.push("today");
    }

    const isOutside = day.getMonth() !== month.getMonth();
    if (isOutside) {
      modifiers.push("outside");
    }

    if (modifierFunctions) {
      const customModifiers = Helpers.getModifiersForDay(day, modifierFunctions);
      modifiers = [...modifiers, ...customModifiers];
    }

    className += modifiers.map(modifier => ` ${className}--${modifier}`).join("");

    if (isOutside && !enableOutsideDays) {
      return <div key={ `outside-${key}` } className={ className } />;
    }

    const { onDayMouseEnter, onDayMouseLeave, onDayTouchTap, onDayClick, onDayMouseUp, onDayMouseDown }
      = this.props;
    let tabIndex = null;
    if ((onDayTouchTap || onDayClick) && !isOutside) {
      tabIndex = -1;
      // Focus on the first day of the month
      if (day.getDate() === 1) {
        tabIndex = this.props.tabIndex;
      }
    }

    const ariaLabel = this.props.localeUtils.formatDate ?
      this.props.localeUtils.formatDate(day) : day.toDateString();
    const ariaDisabled = isOutside ? "true" : "false";

    return (
      <div key={ key } className={ className }
        tabIndex={ tabIndex }
        role="gridcell"
        aria-label={ ariaLabel }
        aria-disabled={ ariaDisabled }
        onKeyDown={
          (e) => this.handleDayKeyDown(e, day, modifiers) }
        onMouseEnter= { onDayMouseEnter ?
          (e) => this.handleDayMouseEnter(e, day, modifiers) : null }
        onMouseLeave= { onDayMouseLeave ?
          (e) => this.handleDayMouseLeave(e, day, modifiers) : null }
        onClick= { onDayClick ?
          (e) => this.handleDayClick(e, day, modifiers) : null }
        onTouchTap= { onDayTouchTap ?
          (e) => this.handleDayTouchTap(e, day, modifiers) : null }
        onMouseDown= { onDayMouseDown ?
          (e) => this.handleDayMouseDown(e, day, modifiers) : null }
        onMouseUp= { onDayMouseUp ?
          (e) => this.handleDayMouseUp(e, day, modifiers) : null }
        >
        { this.props.renderDay(day) }
      </div>
    );
  }

  render() {
    const { numberOfMonths, locale, canChangeMonth, reverseMonths, ...attributes } = this.props;
    const { currentMonth } = this.state;
    let className = `DayPicker DayPicker--${locale}`;

    if (!this.props.onDayClick && !this.props.onDayTouchTap) {
      className = `${className} DayPicker--interactionDisabled`;
    }
    if (attributes.className) {
      className = `${className} ${attributes.className}`;
    }

    const months = [];
    let month;
    for (let i = 0; i < numberOfMonths; i++) {
      month = DateUtils.addMonths(currentMonth, i);
      months.push(this.renderMonth(month, i));
    }

    if (reverseMonths) {
      months.reverse();
    }

    return (
      <div
        {...attributes}
        className={ className }
        ref="dayPicker"
        role="widget"
        tabIndex={ canChangeMonth && attributes.tabIndex }
        onKeyDown={ e => this.handleKeyDown(e) }>
        { canChangeMonth && this.renderNavBar() }
        { months }
      </div>
    );
  }


}
