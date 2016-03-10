import Radium from "radium";
import React, {Component, PropTypes} from "react";
import lodashFind from "lodash.find";

import styles from "./styles";

/**
 * RoundSelectBox component
 *
 * This component is the round select box
 */
@Radium
export default class RoundSelectBox extends Component {

	constructor(properties) {
		super(properties);
		this.state = {
			isOptionListOpen: false
		};

		const { style, ...childProps } = properties;
		this._childProps = childProps;

		this._selectOption = this._selectOption.bind(this);
	}

	/**
	 * Update the childProps based on the updated properties passed to the text box.
	 */
	componentWillReceiveProps(properties) {
		const { style, ...childProps } = properties;
		this._childProps = childProps;
	}

	componentWillUnmount() {
		this._childProps = null;
		this._hiddenSelectRef = null;
	}

	_renderDownArrowIcon() {
		return (
			<svg style={[styles.selectBox.arrowIcon]}
				enable-background="new 0 0 50 50"
				version="1.1"
				viewBox="0 0 50 50">
				<rect fill="none" height="50" width="50"/>
				<polygon points="47.25,15 45.164,12.914 25,33.078 4.836,12.914 2.75,15 25,37.25 "/>
			</svg>
		);
	}

	_selectOption(value) {
		if (value !== this.props.value) {
			this.props.onChange(value);
		}
	}

	_renderOptionsList() {
		let maxHeightFromSizeProp = {};
		if (this.props.size) {
			maxHeightFromSizeProp.maxHeight = this.props.size * styles.option.minHeight;
		}

		let options = null;
		if (this.state.isOptionListOpen) {
			options = React.Children.map(this.props.children, (optionElement, index) => {
				return React.cloneElement(optionElement, {
					key: index,
					onMouseDown: !this.props.disabled && this._selectOption
				}, optionElement.props.children);
			});
		}

		return (
			<div
				style={[
					styles.optionList,
					this.state.isOptionListOpen && styles.optionList.open,
					this.state.isOptionListOpen && this.props.size && maxHeightFromSizeProp,
					!this.state.isOptionListOpen && styles.optionList.closed
				]}>
				{options}
			</div>
		);
	}

	_openOptionList() {
		if (!this.props.disabled) {
			this.setState({ isOptionListOpen: true }, () => {
				this._hiddenSelectRef.focus();
			});
		}
	}

	_renderSelectedOption() {
		// Grab the text from the selected option
		// If no option is selected, display default text
		let valueIsSelected;
		let text;

		if (this.props.value == undefined) {
			// No value is selected
			text = this.props.defaultText;
			valueIsSelected = false;
		}
		else {
			const children = React.Children.toArray(this.props.children);
			const option = lodashFind(children, (c) => {
				return c.props.value === this.props.value;
			});

			// If valid option exists, display it using its label
			if (option) {
				// If the label does not exist, fallback to displaying its value
				text = option.props.displayLabel || option.props.value;
				valueIsSelected = true;
			}
			// If valid option does not exist, display the default text
			else {
				text = this.props.defaultText;
				valueIsSelected = false;
			}
		}

		return (
			<div style={[
				styles.selectBox.selectedOption,
				valueIsSelected && styles.selectBox.selectedOption.selected,
				!valueIsSelected && styles.selectBox.selectedOption.unselected
			]}>
				<span className="st-ui-toolkit-roundselectbox-selected-option-text">{text}</span>
			</div>
		);
	}

	_renderBox() {
		const downIcon = this._renderDownArrowIcon();
		const selectedOption = this._renderSelectedOption();

		return (
			<div
				onClick={() => this._openOptionList()}
				style={[
					styles.selectBox,
					!this.props.disabled && styles.selectBox.enabled,
					this.props.disabled && styles.selectBox.disabled,
					this.props.style && this.props.style.selectBox
				]}>
				<div style={[styles.selectBox.content]}>
					{selectedOption}
					{downIcon}
				</div>
			</div>
		);
	}

	_renderHiddenSelectedOption() {
		if (this.props.value !== undefined) {
			return <option value={this.props.value}>{this.props.value}</option>;
		}
		else {
			return null;
		}
	}

	render() {
		const optionsList = this._renderOptionsList();
		const selectBox = this._renderBox();
		const hiddenSelectedOption = this._renderHiddenSelectedOption();

		return (
			<div
				className={this.props.className}
				style={[this.props.style && this.props.style.base]}>
				<div style={[
					styles.content
				]}>
					<select
						type="hidden"
						value={this.props.value}
						style={styles.hiddenHTMLSelect}
						ref={(c) => this._hiddenSelectRef = c}
						required={this.props.required}
						size={this.props.size}
						disabled={this.props.disabled}
						onMouseDown={(e) => {
							e.preventDefault();
							this._hiddenSelectRef.focus();
						}}
						onBlur={() => this.setState({ isOptionListOpen: false})}
						onFocus={() => this.setState({ isOptionListOpen: true})}>
						{hiddenSelectedOption}
					</select>
					{selectBox}
					{optionsList}
				</div>
			</div>
		);
	}
}

RoundSelectBox.displayName = "RoundSelectBox";

RoundSelectBox.propTypes = {
	style: PropTypes.object,
	disabled: PropTypes.bool,
	value: PropTypes.any,
	defaultText: PropTypes.string,
	size: PropTypes.number,
	onChange: PropTypes.func,
	required: PropTypes.bool
};

RoundSelectBox.defaultProps = {
	disabled: false,
	value: undefined,
	defaultText: "",
	size: null,
	required: false,
	onChange: function() {}
};
