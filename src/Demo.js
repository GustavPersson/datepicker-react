/* eslint react/no-danger: 0 */
import React, { Component } from "react";

import { createHistory } from "history";

import SimpleCalendar from "./SimpleCalendar";
import Range from "./Range";

const history = createHistory();

const EXAMPLES = {
  demo: {
    title: "Date Range Calendar",
    description: "A calendar that supports dragging, week selections, and some more. Based on react-day-picker.",
    Component: Range
  }
};


export default class Demo extends Component {

  render() {
    const currentExample = "demo";

    const ExampleComponent = EXAMPLES[currentExample].Component;

    return (
      <div>

        <div>
          <div className="Examples">
            <h2>
                { EXAMPLES[currentExample].title }
            </h2>
            <p dangerouslySetInnerHTML={{ __html: EXAMPLES[currentExample].description }} />
            <div className="Example">

              <div className="Example-Result">
                <ExampleComponent />
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }

}
