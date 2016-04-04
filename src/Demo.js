/* eslint react/no-danger: 0 */
import React, { Component } from "react";

import { createHistory } from "history";

import SimpleCalendar from "./SimpleCalendar";
import Range from "./Range";

const history = createHistory();

const EXAMPLES = {
  range: {
    title: "Range-Drag Calendar",
    description: "This calendar shows the clicked day in an alert dialog.",
    Component: Range
  }
};


export default class Demo extends Component {

  render() {
    const currentExample = 'range';

    const ExampleComponent = EXAMPLES[currentExample].Component;

    return (
      <div>

        <div>
          <div className="NavBar">
            <div className="NavBar-wrapper">
              <h3>Examples</h3>

              <h3 style={{paddingTop: "1rem"}}>About</h3>
              <a href="http://www.gpbl.org/react-day-picker">
                Documentation
              </a>
              <a href="https://github.com/gpbl/react-day-picker">
                Github
              </a>
            </div>
          </div>

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
