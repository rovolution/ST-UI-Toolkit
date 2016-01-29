/* global jest describe beforeEach it expect */

jest.dontMock('../components/DatePicker');
jest.dontMock('../utils/inject-style');
jest.dontMock('../utils/date-helpers');
jest.dontMock('../config/i18n');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

// Babel would move an import in front of the jest.dontMock. That's why require
// is used instead of import.
const DatePicker = require('../components/DatePicker');
const injectStyle = require('../utils/inject-style');

describe('DatePicker', () => {
  it('should initialise props as expected', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker />
    );
    expect(datePicker.props.month).toBe((new Date()).getMonth() + 1);
    expect(datePicker.props.year).toBe((new Date()).getFullYear());
    expect(datePicker.props.tabIndex).toBe(0);
    expect(datePicker.props['aria-label']).toBe('datepicker');
    expect(datePicker.props.disabled).toBe(false);
    expect(datePicker.props.readOnly).toBe(false);
    expect(datePicker.props.showOtherMonthDate).toBe(true);
  });

  it('should have undefined date value if value is not passed in props', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker />
    );
    expect(datePicker.state.selectedDate).toBeUndefined();
  });

  it('should change date when a day is focused and enter key is pressed', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker wrapperClassName="date_picker_wrapper"/>
    );

    expect(datePicker.state.selectedDate).toBeUndefined();
    const dayPickerWrapper = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'date_picker_wrapper')[0];
    TestUtils.Simulate.focus(dayPickerWrapper);
    TestUtils.Simulate.keyDown(dayPickerWrapper, {key: 'Enter'});
    expect(datePicker.state.selectedDate).toBeGreaterThan(0);
  });

  it('should select / deselect date when space key is pressed', () => {
    let dateSelected;
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker onUpdate={ (obj) => dateSelected = obj.value }/>
    );

    expect(datePicker.state.selectedDate).toBeUndefined();

    // const day = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'day_test')[8];
    const dayPickerWrapper = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'date_picker_wrapper')[0];
    TestUtils.Simulate.focus(dayPickerWrapper);
    TestUtils.Simulate.keyDown(dayPickerWrapper, {key: ' '});
    expect(datePicker.state.selectedDate).toBeGreaterThan(0);
    expect(dateSelected).toBeGreaterThan(0);

    // expect(dateSelected.getDay()).toBeGreaterThan(0);
    TestUtils.Simulate.keyDown(dayPickerWrapper, {key: ' '});
    expect(datePicker.state.selectedDate).toBeUndefined();
    expect(dateSelected).toBeUndefined();
  });

  it('should not change date when a day is focused and enter key is pressed if component is disabled or readOnly', () => {
    const disabledDatePicker = TestUtils.renderIntoDocument(
      <DatePicker dayProps={{ className: 'day_test' }} disabled/>
    );
    expect(disabledDatePicker.state.selectedDate).toBeUndefined();
    let day = TestUtils.scryRenderedDOMComponentsWithClass(disabledDatePicker, 'day_test')[8];
    TestUtils.Simulate.focus(day);
    TestUtils.Simulate.keyDown(day, {key: 'Enter'});
    expect(disabledDatePicker.state.selectedDate).toBeUndefined();

    const readOnlyDatePicker = TestUtils.renderIntoDocument(
      <DatePicker dayProps={{ className: 'day_test' }} readOnly/>
    );
    expect(readOnlyDatePicker.state.selectedDate).toBeUndefined();
    day = TestUtils.scryRenderedDOMComponentsWithClass(readOnlyDatePicker, 'day_test')[8];
    TestUtils.Simulate.focus(day);
    TestUtils.Simulate.keyDown(day, {key: 'Enter'});
    expect(readOnlyDatePicker.state.selectedDate).toBeUndefined();
  });

  it('should change focusedDateKey on mouse down', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker dayProps={{ className: 'day_test' }}/>
    );

    expect(datePicker.state.focusedDateKey).toBeUndefined();
    const day = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'day_test')[8];
    TestUtils.Simulate.mouseDown(day, {button: 0});
    expect(datePicker.state.focusedDateKey).toBeDefined();
  });

  it('should reduce focusedDateKey by 1 when arrowLeft is pressed', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker wrapperClassName="date_picker"/>
    );

    expect(datePicker.state.focusedDateKey).toBeUndefined();
    const datePickerWrapper = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'date_picker')[0];
    TestUtils.Simulate.focus(datePickerWrapper);
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const prevFocusedDate = new Date(datePicker.state.focusedDateKey);
    TestUtils.Simulate.keyDown(datePickerWrapper, {key: 'ArrowLeft'});
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const nextFocusedDate = new Date(datePicker.state.focusedDateKey);
    prevFocusedDate.setDate(prevFocusedDate.getDate() - 1);
    expect(prevFocusedDate.getDate() === nextFocusedDate.getDate()).toBeTruthy();
  });

  it('should increase focusedDateKey by 1 when arrowLeft is pressed for arabic calendar', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker wrapperClassName="date_picker" locale="ar"/>
    );

    expect(datePicker.state.focusedDateKey).toBeUndefined();
    const datePickerWrapper = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'date_picker')[0];
    TestUtils.Simulate.focus(datePickerWrapper);
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const prevFocusedDate = new Date(datePicker.state.focusedDateKey);
    TestUtils.Simulate.keyDown(datePickerWrapper, {key: 'ArrowLeft'});
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const nextFocusedDate = new Date(datePicker.state.focusedDateKey);
    prevFocusedDate.setDate(prevFocusedDate.getDate() + 1);
    expect(prevFocusedDate.getDate() === nextFocusedDate.getDate()).toBeTruthy();
  });

  it('should reduce focusedDateKey by 7 when arrowUp is pressed', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker wrapperClassName="date_picker"/>
    );

    expect(datePicker.state.focusedDateKey).toBeUndefined();
    const datePickerWrapper = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'date_picker')[0];
    TestUtils.Simulate.focus(datePickerWrapper);
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const prevFocusedDate = new Date(datePicker.state.focusedDateKey);
    TestUtils.Simulate.keyDown(datePickerWrapper, {key: 'ArrowUp'});
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const nextFocusedDate = new Date(datePicker.state.focusedDateKey);
    prevFocusedDate.setDate(prevFocusedDate.getDate() - 7);
    expect(prevFocusedDate.getDate() === nextFocusedDate.getDate()).toBeTruthy();
  });

  it('should increase focusedDateKey by 1 when arrowRight is pressed', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker wrapperClassName="date_picker"/>
    );

    expect(datePicker.state.focusedDateKey).toBeUndefined();
    const datePickerWrapper = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'date_picker')[0];
    TestUtils.Simulate.focus(datePickerWrapper);
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const prevFocusedDate = new Date(datePicker.state.focusedDateKey);
    TestUtils.Simulate.keyDown(datePickerWrapper, {key: 'ArrowRight'});
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const nextFocusedDate = new Date(datePicker.state.focusedDateKey);
    prevFocusedDate.setDate(prevFocusedDate.getDate() + 1);
    expect(prevFocusedDate.getDate() === nextFocusedDate.getDate()).toBeTruthy();
  });

  it('should reduce focusedDateKey by 1 when arrowRight is pressed for arabic calendar', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker wrapperClassName="date_picker" locale="ar"/>
    );

    expect(datePicker.state.focusedDateKey).toBeUndefined();
    const datePickerWrapper = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'date_picker')[0];
    TestUtils.Simulate.focus(datePickerWrapper);
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const prevFocusedDate = new Date(datePicker.state.focusedDateKey);
    TestUtils.Simulate.keyDown(datePickerWrapper, {key: 'ArrowRight'});
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const nextFocusedDate = new Date(datePicker.state.focusedDateKey);
    prevFocusedDate.setDate(prevFocusedDate.getDate() - 1);
    expect(prevFocusedDate.getDate() === nextFocusedDate.getDate()).toBeTruthy();
  });

  it('should increase focusedDateKey by 1 when arrowRight is pressed', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker wrapperClassName="date_picker"/>
    );

    expect(datePicker.state.focusedDateKey).toBeUndefined();
    const datePickerWrapper = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'date_picker')[0];
    TestUtils.Simulate.focus(datePickerWrapper);
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const prevFocusedDate = new Date(datePicker.state.focusedDateKey);
    TestUtils.Simulate.keyDown(datePickerWrapper, {key: 'ArrowDown'});
    expect(datePicker.state.focusedDateKey).toBeDefined();
    const nextFocusedDate = new Date(datePicker.state.focusedDateKey);
    prevFocusedDate.setDate(prevFocusedDate.getDate() + 7);
    expect(prevFocusedDate.getDate() === nextFocusedDate.getDate()).toBeTruthy();
  });

  it.only('should show days in decreasing order if RTL for locale is true', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker dayProps={{ className: 'date_picker_day' }} locale="ar"/>
    );

    const datePickerDays = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'date_picker_day');
    const firstDay = ReactDOM.findDOMNode(datePickerDays[0]).textContent;
    const secondDay = ReactDOM.findDOMNode(datePickerDays[1]).textContent;
    expect(firstDay).toBeGreaterThan(secondDay);
  });

  it('should show friday as first day of week according to locale data in decreasing order', () => {
    const datePickerAr = TestUtils.renderIntoDocument(
      <DatePicker dayProps={{ className: 'date_picker_day' }} locale="ar"/>
    );

    const datePickerDays = TestUtils.scryRenderedDOMComponentsWithClass(datePickerAr, 'date_picker_day');
    const firstDate = ReactDOM.findDOMNode(datePickerDays[0]).textContent;
    expect(parseInt(firstDate, 10) + 1).toBe(5);
  });

  it('should show friday as first day of week according to locale data', () => {
    const datePickerHe = TestUtils.renderIntoDocument(
      <DatePicker dayProps={{ className: 'date_picker_day' }} locale="he"/>
    );
    const datePickerDays = TestUtils.scryRenderedDOMComponentsWithClass(datePickerHe, 'date_picker_day');
    const firstDate = new Date(datePickerDays[0]._reactInternalInstance._currentElement.ref);
    expect(6 - parseInt(firstDate, 10)).toBe(5);
  });

  it('should change selectedDate when a day receives mouseDown with button 0', () => {
    let dateSelected;
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker dayProps={{ className: 'day_test' }} onUpdate={ (obj) => dateSelected = obj.value }/>
    );

    expect(datePicker.state.selectedDate).toBeUndefined();
    let day = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'day_test')[8];
    TestUtils.Simulate.focus(day);
    TestUtils.Simulate.mouseDown(day, {button: 0});
    const newDate = datePicker.state.selectedDate;
    expect(datePicker.state.selectedDate).toBeGreaterThan(0);
    expect(dateSelected.getDay()).toBeGreaterThan(0);
    day = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'day_test')[10];
    TestUtils.Simulate.mouseDown(day, {button: 1});
    expect(datePicker.state.selectedDate).toBe(newDate);
  });

  it('should not change selectedDate in state if component uses value property', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker dayProps={{ className: 'day_test' }} value={ undefined }/>
    );

    expect(datePicker.state.selectedDate).toBeUndefined();
    const day = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'day_test')[8];
    TestUtils.Simulate.focus(day);
    TestUtils.Simulate.mouseDown(day, {button: 0});
    expect(datePicker.state.selectedDate).toBeUndefined();
  });

  it('should not change selectedDate in state if component uses valueLink property', () => {
    const compSelectedDate = new Date();
    const valueLink = {
      value: compSelectedDate,
      requestChange: () => {
        // compSelectedDate = newValue;
      },
    };

    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker dayProps={{ className: 'day_test' }} valueLink={ valueLink }/>
    );

    expect(datePicker.state.selectedDate).toBe(compSelectedDate);
    const day = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'day_test')[8];
    TestUtils.Simulate.focus(day);
    TestUtils.Simulate.mouseDown(day, {button: 0});
    expect(datePicker.state.selectedDate).toBe(compSelectedDate);
  });

  it('should inject styles for hover, active & foucs', () => {
    TestUtils.renderIntoDocument(
      <DatePicker />
    );

    expect(injectStyle.injectStyles.mock.calls.length).toBe(1);
    const styles = injectStyle.injectStyles.mock.calls[0][0];
    expect(styles.styleId).toBeDefined();
    expect(styles.prevMonthNavStyleId).toBeDefined();
    expect(styles.nextMonthNavStyleId).toBeDefined();
  });

  it('should call function removeAllStyles when component will unmount', () => {
    DatePicker.updatePseudoClassStyle = jest.genMockFunction();
    injectStyle.removeAllStyles = jest.genMockFunction();
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker />
    );
    datePicker.componentWillUnmount();
    expect(injectStyle.removeAllStyles.mock.calls.length).toBe(1);
  });

  it('should update state.selectedDate when value is received in props', () => {
    const currentDate = new Date();
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker/>
    );
    expect(datePicker.state.selectedDate).toBeUndefined();
    datePicker.componentWillReceiveProps({value: currentDate});
    expect(datePicker.state.selectedDate).toBe(currentDate);
  });

  it('should update state.selectedDate when valueLink is received in props', () => {
    const currentDate = new Date();
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker/>
    );
    let compSelectedDate = currentDate;
    const valueLink = {
      value: compSelectedDate,
      requestChange: (newValue) => {
        compSelectedDate = newValue;
      },
    };
    expect(datePicker.state.selectedDate).toBeUndefined();
    datePicker.componentWillReceiveProps({valueLink: valueLink});
    expect(datePicker.state.selectedDate).toBe(currentDate);
  });

  it('should not update state.selectedDate when defaultValue is received in props', () => {
    const currentDate = new Date();
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker defaultValue={ undefined }/>
    );
    expect(datePicker.state.selectedDate).toBeUndefined();
    datePicker.componentWillReceiveProps({defaultValue: currentDate});
    expect(datePicker.state.selectedDate).toBeUndefined();
  });

  it('should set isFocused to true when wrapper receives focus and to false on blur', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker className="wrapper_test"/>
    );
    const wrapper = TestUtils.findRenderedDOMComponentWithClass(datePicker, 'wrapper_test');
    TestUtils.Simulate.focus(wrapper);
    expect(datePicker.state.isFocused).toBeTruthy();
    TestUtils.Simulate.blur(wrapper);
    expect(datePicker.state.isFocused).toBeFalsy();
  });

  it('should not set isFocused to true when wrapper receives focus btu component is disabled', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker className="wrapper_test" disabled/>
    );
    const wrapper = TestUtils.findRenderedDOMComponentWithClass(datePicker, 'wrapper_test');
    TestUtils.Simulate.focus(wrapper);
    expect(datePicker.state.isFocused).toBeFalsy();
  });

  it('should not set isFocused to true when wrapper receives focus but is active', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker className="wrapper_test"/>
    );
    const wrapper = TestUtils.findRenderedDOMComponentWithClass(datePicker, 'wrapper_test');
    TestUtils.Simulate.mouseDown(wrapper, {button: 0});
    expect(datePicker.state.isActive).toBeTruthy();
    TestUtils.Simulate.focus(wrapper);
    expect(datePicker.state.isFocused).toBeFalsy();
  });

  it('should not set isActive to true when touch starts and reset when touch ends', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker className="wrapper_test"/>
    );
    const wrapper = TestUtils.findRenderedDOMComponentWithClass(datePicker, 'wrapper_test');
    TestUtils.Simulate.touchStart(wrapper, {touches: {length: 1}});
    expect(datePicker.state.isActive).toBeTruthy();
    TestUtils.Simulate.touchEnd(wrapper);
    expect(datePicker.state.isActive).toBeFalsy();
  });

  it('should set isWrapperHovered on mouse over for all components including disabled and readOnly', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker className="wrapper_test"/>
    );
    const wrapper = TestUtils.findRenderedDOMComponentWithClass(datePicker, 'wrapper_test');
    TestUtils.Simulate.mouseEnter(wrapper);
    expect(datePicker.state.isWrapperHovered).toBeTruthy();
    TestUtils.Simulate.mouseLeave(wrapper);
    expect(datePicker.state.isWrapperHovered).toBeFalsy();

    const disabledDatePicker = TestUtils.renderIntoDocument(
      <DatePicker disabled dayProps={{ className: 'day_test' }} className="wrapper_test"/>
    );
    const disabledWrapper = TestUtils.findRenderedDOMComponentWithClass(disabledDatePicker, 'wrapper_test');
    TestUtils.Simulate.mouseEnter(disabledWrapper);
    expect(disabledDatePicker.state.isWrapperHovered).toBeTruthy();
    TestUtils.Simulate.mouseLeave(disabledWrapper);
    expect(disabledDatePicker.state.isWrapperHovered).toBeFalsy();

    const readOnlyDatePicker = TestUtils.renderIntoDocument(
      <DatePicker readOnly dayProps={{ className: 'day_test' }} className="wrapper_test"/>
    );
    const readOnlyWrapper = TestUtils.findRenderedDOMComponentWithClass(readOnlyDatePicker, 'wrapper_test');
    TestUtils.Simulate.mouseEnter(readOnlyWrapper);
    expect(readOnlyDatePicker.state.isWrapperHovered).toBeTruthy();
    TestUtils.Simulate.mouseLeave(readOnlyWrapper);
    expect(readOnlyDatePicker.state.isWrapperHovered).toBeFalsy();
  });

  it('should not focus day on disabled component', () => {
    const disabledDatePicker = TestUtils.renderIntoDocument(
      <DatePicker disabled dayProps={{ className: 'day_test' }}/>
    );
    expect(disabledDatePicker.state.focusedDateKey).toBeUndefined();
    const day = TestUtils.scryRenderedDOMComponentsWithClass(disabledDatePicker, 'day_test')[8];
    TestUtils.Simulate.focus(day);
    expect(disabledDatePicker.state.focusedDateKey).toBeUndefined();
  });

  it('should focus readOnly component', () => {
    const readOnlyDatePicker = TestUtils.renderIntoDocument(
      <DatePicker wrapperClassName="date_picker" readOnly dayProps={{ className: 'day_test' }}/>
    );
    expect(readOnlyDatePicker.state.focusedDateKey).toBeUndefined();
    const datePicker = TestUtils.scryRenderedDOMComponentsWithClass(readOnlyDatePicker, 'date_picker')[0];
    TestUtils.Simulate.focus(datePicker);
    expect(readOnlyDatePicker.state.isFocused).toBeTruthy();
  });

  it('should decrease month when prevMonthNav is clicked', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker prevMonthNavClassName="prev_month"/>
    );
    const month = datePicker.state.month > 1 ? datePicker.state.month : 13;
    const prevMonth = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'prev_month')[0];
    TestUtils.Simulate.mouseDown(prevMonth, {button: 0});
    expect(datePicker.state.month).toBe(month - 1);
  });

  it('should increase month when nextMonthNav is clicked', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker nextMonthNavClassName="next_month"/>
    );
    const month = datePicker.state.month > 1 ? datePicker.state.month : 13;
    const nextMonth = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'next_month')[0];
    TestUtils.Simulate.mouseDown(nextMonth, {button: 0});
    expect(datePicker.state.month).toBe(month + 1);
  });

  it('should set activeDay when touch starts on a day and reset when touch ends', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker dayProps={{ className: 'day_test' }}/>
    );
    const day = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'day_test')[8];
    expect(datePicker.state.activeDay).toBeFalsy();
    TestUtils.Simulate.touchStart(day, {touches: {length: 1}});
    expect(datePicker.state.activeDay).toBeTruthy();
    TestUtils.Simulate.touchEnd(day, {touches: {length: 1}});
    expect(datePicker.state.activeDay).toBeFalsy();
  });

  it('should apply hover styles to wrapper when mouse is over', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker className="wrapper_test" hoverStyle={ {backgroundColor: 'red'} }/>
    );
    const wrapper = TestUtils.findRenderedDOMComponentWithClass(datePicker, 'wrapper_test');
    TestUtils.Simulate.mouseEnter(wrapper);
    expect(datePicker.state.isWrapperHovered).toBeTruthy();
    expect(wrapper.getAttribute('style')).toContain('background-color: red');
    TestUtils.Simulate.mouseLeave(wrapper);
    expect(datePicker.state.isWrapperHovered).toBeFalsy();
  });

  it('should apply activeDayStyle to day when touchStart but immediately after touchEnd should apply selectedDayStyle', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker activeDayStyle={ {color: 'blue'} } selectedDayStyle={ {color: 'red'} } dayProps={{ className: 'day_test' }}/>
    );
    expect(datePicker.state.selectedDate).toBeUndefined();
    const day = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'day_test')[8];
    TestUtils.Simulate.touchStart(day, {touches: {length: 1}});
    expect(datePicker.state.selectedDate.getDay()).toBeGreaterThan(0);
    expect(day.getAttribute('style')).toContain('color: blue');
    TestUtils.Simulate.touchEnd(day, {touches: {length: 1}});
    expect(day.getAttribute('style')).toContain('color: red');
  });

  it('should not apply focusDayStyles for mouseDown wrapper', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker style={ {fontSize: '10px'} } focusStyle={ {fontSize: '5px'} } activeStyle={ {backgroundColor: 'blue'} } wrapperClassName="date_picker"/>
    );
    const picker = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'date_picker')[0];
    TestUtils.Simulate.mouseDown(picker, {button: 0});
    expect(picker.getAttribute('style')).toContain('background-color: blue');
    expect(picker.getAttribute('style')).toContain('font-size: 10px');
    TestUtils.Simulate.mouseUp(picker, {button: 0});
    expect(picker.getAttribute('style')).not.toContain('background-color: blue');
  });

  it('should apply focusDayStyles for mouseDown by on day', () => {
    const datePicker = TestUtils.renderIntoDocument(
      <DatePicker focusDayStyle={ {fontSize: '5px'} } activeDayStyle={ {backgroundColor: 'blue'} } dayProps={{ className: 'day_test' }}/>
    );
    const day = TestUtils.scryRenderedDOMComponentsWithClass(datePicker, 'day_test')[8];
    TestUtils.Simulate.mouseDown(day, {button: 0});
    expect(datePicker.state.selectedDate.getDay()).toBeGreaterThan(0);
    expect(day.getAttribute('style')).toContain('background-color: blue');
    expect(day.getAttribute('style')).toContain('font-size: 5px');
    TestUtils.Simulate.mouseUp(day, {button: 0});
    expect(day.getAttribute('style')).not.toContain('background-color: blue');
  });
});
