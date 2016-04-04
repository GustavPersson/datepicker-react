/* eslint react/no-danger: 0 */
import React, { Component } from "react";

import { createHistory } from "history";

import "./vendors/prism.css";

import SimpleCalendar from "./SimpleCalendar";

const history = createHistory();

const EXAMPLES = {
  simple: {
    title: "Simple Calendar",
    description: "This calendar shows the clicked day in an alert dialog.",
    Component: SimpleCalendar
  }
};


export default class Demo extends Component {

  render() {
    const { currentExample, showNavBar } = this.state;

    const ExampleComponent = EXAMPLES[currentExample].Component;

    return (
      <div>

        <div className={ `Content${showNavBar ? " navbar-is-visible" : ""}` }>

          <div className="NavBar">
            <div className="NavBar-wrapper">
              <h3>Examples</h3>
              { this.renderNavBarExamples() }

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
              <div className="Example-Code">
                <pre>
                  <code className="language-jsx">
                    { require("!raw!./examples/" + ExampleComponent.name + ".js")}
                  </code>
                </pre>
              </div>
            </div>

            <p style={{fontSize: "0.75em"}}>
              <a href={`https://github.com/gpbl/react-day-picker/blob/master/examples/src/examples/${ExampleComponent.name}.js`}>See source on Github</a>
            </p>
          </div>
        </div>
      </div>

    );
  }

}
