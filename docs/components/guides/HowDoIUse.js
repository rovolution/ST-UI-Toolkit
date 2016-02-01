import React, {Component} from 'react';
import {Card, Toggle} from 'belle';
import Code from '../Code';

const usageExampleHtml = `const React = require('react');
const ReactDOM = require('react-dom');
const SToolkit = require('@socialtables/ui-stoolkit');
const Button = SToolkit.Button;

class App extends React.Component {
  _clickHandler() {
    alert("YOLO");
  }

  render() {
    return <div>
      <Button onClick={this._clickHandler} />
    </div>;
  }
}

ReactDOM.render(<App/>, document.getElementById('react-root'));`;

export default class HowDoIUse extends Component {

  render() {
    return (<div>
      <h1 style={ {marginTop: 0, marginBottom: 20} }>How Do I Use a Component In My App?</h1>

      <p>
        To use one of the components in your library, import the library into your application.
        <br/><br/>
        Access the component you want to use via the namespace, and then use it like you would any other React component!
        <br/><br/>
        See the documentation for the specific component to get more details regarding the props it consumes.
      </p>

      <Code value={ usageExampleHtml } style={ {marginTop: 40} } />
    </div>);
  }
}
