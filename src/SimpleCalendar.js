import React from "react";
import DayPicker from "./react-day-picker/DayPicker";

export default function SimpleCalendar() {
  return <DayPicker onDayClick={ (e, day) => alert(day) } />;
}

