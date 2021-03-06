import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Column from './Column';
import {Card} from '@socialtables/st-ui-toolkit';


const LEFT_HAND_MENU_LINK_STYLE = {
  display: 'block',
  padding: '3px 0'
};


export default React.createClass({

  propTypes: {
    route: PropTypes.any.isRequired,
    children: PropTypes.any.isRequired,
    location: PropTypes.object,
  },

  childContextTypes: {
    viewport: PropTypes.any,
  },

  getInitialState() {
    return {
      viewport: this._getRetrieveViewport(),
    };
  },

  getChildContext() {
    return {
      viewport: this._getRetrieveViewport(),
    };
  },

  componentWillMount() {
    window.addEventListener('resize', this._triggerResizeMixinCallback);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this._triggerResizeMixinCallback);
  },

  _getRetrieveViewport() {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  },

  _triggerResizeMixinCallback() {
    this.setState({
      viewport: this._getRetrieveViewport(),
    });
  },

  _renderHomeHeader() {
    return (
      <header style={ {background: 'linear-gradient(50deg, #cb5599, #FFFFFF)', width: '100%', marginBottom: 40} }>
        <Column smallScreenStyle={{ width: '100%', padding: '0 20px' }}
                mediumScreenStyle={{margin: '0 auto', width: 910, paddingLeft: 160, paddingRight: 110, paddingBottom: 35 }}>
          <Link to="/">
            <h1 style={{ fontSize: 80,
                         margin: 0,
                         paddingTop: 80,
                         color: '#FFF',
                         fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
                         position: 'relative',
                       }}>
              <div style={{ width: 120,
                            height: 100,
                            paddingLeft: 18,
                            display: 'block',
                            float: 'left',
                            marginRight: 12, }}>
                <img src="images/ST_Icon_White.png"
                     style={{ width: "100%", height: "100%", borderRadius: 55 }} />
              </div>
              <span style={{ marginTop: -6,
                             display: 'block',
                             float: 'left',
                             marginLeft: 10 }}>
                ST-UI-Toolkit
              </span>
            </h1>
          </Link>
          <p style={{ fontSize: 22, marginTop: 0, paddingTop: 20, color: '#FEFEFE', clear: 'both'}}>
            React Components for Common UI Patterns used at Social Tables
          </p>
        </Column>
      </header>
    );
  },

  _renderDefaultHeader() {
    return (
      <header style={{background: 'linear-gradient(50deg, #cb5599, #FFFFFF)', width: '100%', marginBottom: 40 }}>
        <Column smallScreenStyle={{ width: '100%', padding: '0 20px' }}
                mediumScreenStyle={{margin: '0 auto', width: 910, paddingRight: 110 }}>
          <Link style={{ display: 'inline' }} to="/">
            <h1 style={{ fontSize: 24, margin: 0, padding: '10px 0', color: '#FFF', fontFamily: '"Trebuchet MS", Helvetica, sans-serif' }}>
              <div style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}>
                <img src="images/ST_Icon_White.png"
                     style={{ height: 50, width: 50, borderRadius: 50 }} />
                <div style={{ marginLeft: 10}}>ST-UI-Toolkit</div>
              </div>
            </h1>
          </Link>
        </Column>
      </header>
    );
  },

  render() {
    const cardContentStyle = (this.state.viewport.width <= 480) ? { padding: 20 } : {};

    return (<div style={{ background: '#F7F7F7' }}>

      { this.props.location.pathname === '/' ? this._renderHomeHeader() : this._renderDefaultHeader() }

      <Column smallScreenStyle={{ width: '100%' }}
              mediumScreenStyle={{margin: '0 auto', width: 910, paddingRight: 110 }}>

        <Column smallScreenStyle={{ width: '100%', padding: '0 40px' }}
                mediumScreenStyle={{ float: 'left', width: 160 }}
                className="navigation">
          <ul style={ { listStyleType: 'none', paddingLeft: 0, marginTop: 0 } }>
            <li>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/getting-started">Getting Started</Link>
            </li>
          </ul>
          <span style={ { color: '#738088' } } >Components</span>
          <ul style={ { listStyleType: 'none', paddingLeft: 0 } }>
            <li>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/component/button">Button</Link>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/component/card">Card</Link>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/component/text-box">TextBox</Link>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/component/checkbox">Checkbox</Link>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/component/tabs">Tabs</Link>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/component/modal">Modal</Link>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/component/growler">Growler</Link>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/component/radio-button">Radio Button</Link>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/component/select-box">SelectBox</Link>
            </li>
          </ul>
          <span style={ { color: '#738088' } } >Guides / Philosophy</span>
          <ul style={ { listStyleType: 'none', paddingLeft: 0 } }>
            <li>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/guide/introducing">What is ST-UI-Toolkit?</Link>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/guide/how-to-use">How Do I Use a Component In My App?</Link>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/guide/component-styling">Component Styling</Link>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/guide/adding-components">How Do I Add a Component To the Toolkit?</Link>
            </li>
          </ul>
          <span style={ { color: '#738088' } } >Other</span>
          <ul style={ { listStyleType: 'none', paddingLeft: 0 } }>
            <li>
              <Link style={LEFT_HAND_MENU_LINK_STYLE} to="/about">About</Link>
            </li>
            <li>
              <a style={LEFT_HAND_MENU_LINK_STYLE} href="https://github.com/socialtables/st-ui-toolkit" target="_blank">Code on Github</a>
            </li>
            <li>
              <a style={LEFT_HAND_MENU_LINK_STYLE} href="https://github.com/socialtables/st-ui-toolkit/issues" target="_blank">Report an Issue</a>
            </li>
          </ul>
        </Column>
        <Column smallScreenStyle={{ width: '96%', margin: '0 auto' }}
                mediumScreenStyle={{ float: 'left', width: 640 }}>
          <Card style={ cardContentStyle }>
            { this.props.children }
          </Card>
        </Column>
        <div style={{ clear: 'left' }}></div>
      </Column>
      <footer style={{ clear: 'both', textAlign: 'center', paddingTop: 40, paddingBottom: 60 }}>
        <a href="http://www.socialtables.com" target="_blank">
          <img style={{ width: 200 }}src="images/ST_HORIZONTAL_ICON.png" />
        </a>
      </footer>
    </div>);
  },
});
