import React, {Component} from 'react';
import {Growler, Button} from '@socialtables/st-ui-toolkit';
import Code from '../Code';
import {propertyNameStyle, propertyDescriptionStyle} from '../../style';

const basicCodeExample = `<Growler
  open={this.state.isFirstGrowlerOpen}
  listenForExternalCloseEvent={true}
  onCloseRequest={() => this.setState({isFirstGrowlerOpen: false})}>
  <section style={{padding: 15}}>
    <div>
      You opened the Growler! Press Esc to get rid of me!
    </div>
  </section>
</Growler>`;

const timeoutCodeExample = `<Growler
  open={this.state.isSecondGrowlerOpen}
  listenForExternalCloseEvent={true}
  timeToClose={3000}
  onCloseRequest={() => this.setState({isSecondGrowlerOpen: false})}>
  <section style={{padding: 15}}>
    <div>
      You opened the Growler! I'll fade away on my own...
    </div>
  </section>
</Growler>`;

export default class GrowlerDocumentation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isFirstGrowlerOpen: false,
      isSecondGrowlerOpen: false
    };
  };

  render() {
    return (<div>

      <h2 style={ {marginTop: 0, marginBottom: 40} }>Growler</h2>

      <Button onClick={() => this.setState({isFirstGrowlerOpen: true, isSecondGrowlerOpen: false})}>
        Click to Open Growler
      </Button>
      <Growler
        open={this.state.isFirstGrowlerOpen}
        listenForExternalCloseEvent={true}
        onCloseRequest={() => this.setState({isFirstGrowlerOpen: false})}>
        <section style={{padding: 15}}>
          <div>
            You opened the Growler! Press Esc to get rid of me!
          </div>
        </section>
      </Growler>

      <Code value={ basicCodeExample } style={ {marginTop: 40} } />

      <Button onClick={() => this.setState({isFirstGrowlerOpen: false, isSecondGrowlerOpen: true})}>
        Click to Open Second Growler
      </Button>
      <Growler
        open={this.state.isSecondGrowlerOpen}
        listenForExternalCloseEvent={true}
        timeToClose={3000}
        onCloseRequest={() => this.setState({isSecondGrowlerOpen: false})}>
        <section style={{padding: 15}}>
          <div>
            You opened the Growler! I'll fade away on my own...
          </div>
        </section>
      </Growler>

      <Code value={ timeoutCodeExample } style={ {marginTop: 40} } />

      <h3>Properties</h3>

      <table><tbody>

        <tr>
          <td style={ propertyNameStyle }>
            open
          </td>
        </tr>
        <tr>
          <td style={ propertyDescriptionStyle }>
            <p >
              <i>Boolean</i>
              <br />
              <b>default:</b> false
            </p>
            <p>If true, the growler will be displayed. If false, the growler will be hidden</p>
          </td>
        </tr>

        <tr>
          <td style={ propertyNameStyle }>
            onCloseRequest
          </td>
        </tr>
        <tr>
          <td style={ propertyDescriptionStyle }>
            <p >
              <i>Boolean</i>
              <br />
              <b>default:</b> no-op function
            </p>
            <p>Function is triggered when the growler is about to close. A closing event can be one of the following: </p>
            <ul>
              <li>The Growler component is given a prop of <b>open: false</b> on the next React rendering cycle</li>
              <li>An external close event is triggered: see documentation for the <b>listenForExternalCloseEvent</b> prop for a list of external close events</li>
            </ul>
          </td>
        </tr>

        <tr>
          <td style={ propertyNameStyle }>
            listenForExternalCloseEvent
          </td>
        </tr>
        <tr>
          <td style={ propertyDescriptionStyle }>
            <p >
              <i>Boolean</i>
              <br />
              <b>default:</b> true
            </p>
            <p>If true, the <b>onCloseRequest()</b> callback will be triggered when the <i>Esc</i> key is pressed</p>
          </td>
        </tr>

        <tr>
          <td style={ propertyNameStyle }>
            timeToClose
          </td>
        </tr>
        <tr>
          <td style={ propertyDescriptionStyle }>
            <p >
              <i>Number</i>
              <br />
              <b>default:</b> null
            </p>
            <p>If set, the <b>onCloseRequest()</b> callback will be triggered after that number of miliseconds has passed</p>
          </td>
        </tr>

      </tbody></table>

    </div>);
  }
}
