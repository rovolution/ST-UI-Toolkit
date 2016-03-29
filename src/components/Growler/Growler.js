import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom";
import GrowlerContentWrapper from "./GrowlerContentWrapper";

/**
 * Declare animation-related properties at the top so that they can be changed in this one spot in the code
 */
const REVEALED_GROWLER_CONTENT_TRANSFORM = "translateY(-50%)";
const HIDDEN_GROWLER_CONTENT_TRANSFORM = "translateY(-53%)";
const ST_UI_REVEALED_GROWLER_CLASS = "ST_UI_REVEALED_GROWLER_CLASS";
const ST_UI_HIDDEN_GROWLER_CLASS = "ST_UI_HIDDEN_GROWLER_CLASS";

/**
 * Growler component
 */
export default class Growler extends Component {

	constructor(props) {
		super(props);
		const { style, ...childProps } = props;
		this._childProps = childProps;

		this._triggerOnCloseRequestOnEscKeyPress = this._triggerOnCloseRequestOnEscKeyPress.bind(this);
		this._fadeInGrowler = this._fadeInGrowler.bind(this);
		this._fadeOutGrowler = this._fadeOutGrowler.bind(this);

		this._createGrowlerContainer();
	}

	/**
	 * Update the childProps based on the updated properties passed to the growler.
	 */
	componentWillReceiveProps(props) {
		const { style, ...childProps } = props;
		this._childProps = childProps;
	}

	componentWillMount() {
		this._hideShowGrowlerContainer(this.props);
	}

	componentWillUpdate(nextProps) {
		this._hideShowGrowlerContainer(nextProps);

		if (nextProps.timeToClose && nextProps.open) {
			setTimeout(this._fadeOutGrowler, nextProps.timeToClose);
		}
	}

	componentDidMount() {
		this._renderGrowlerContent();
	}

	componentDidUpdate() {
		this._renderGrowlerContent();
	}

	componentWillUnmount() {
		// Remove event listeners
		this._removeCloseRequestListeners();

		// Remove growler content from DOM
		if (this._growlerContentElement) {
			ReactDOM.unmountComponentAtNode(this._growlerContentElement);
		}

		// Nullify references to DOM nodes to ensure proper garbage collection
		this._growlerContentElement = null;
		this._cachedBodyElementReference = null;
		this._childProps = null;
	}

	_hideShowGrowlerContainer({ open }) {
		if (open) {
			// mark growler as revealed
			this._growlerContentElement.className = ST_UI_REVEALED_GROWLER_CLASS;

			// reveal growler
			this._fadeInGrowler();

			// bind event listeners
			if (this.props.listenForExternalCloseEvent) {
				this._bindCloseRequestListeners();
			}
		}

		const revealedGrowlers = document.getElementsByClassName(ST_UI_REVEALED_GROWLER_CLASS) || {};
		if (revealedGrowlers.length) {
			this._cachedBodyElementReference.style.overflow = "hidden";
		}
		else {
			this._cachedBodyElementReference.style.overflow = "";
		}
	}

	_fadeInGrowler() {
		let op = 0.1;  // initial opacity
		var fadeIn = () => {
			if (op >= 0.7) {
				this._growlerContentElement.style.transform = REVEALED_GROWLER_CONTENT_TRANSFORM;
			}
			else {
				op += op * 0.1;
				this._growlerContentElement.style.opacity = op;
				this._growlerContentElement.style.filter = `alpha(opacity= ${op * 100} )`;
				requestAnimationFrame(fadeIn);
			}
		};
		fadeIn();
	}

	_fadeOutGrowler() {
		let op = 0.7;  // initial opacity
		var fadeOut = () => {
			if (op <= 0.1) {
				this._growlerContentElement.style.transform = HIDDEN_GROWLER_CONTENT_TRANSFORM;
				this.props.onCloseRequest();
			}
			else {
				op -= op * 0.1;
				this._growlerContentElement.style.opacity = op;
				this._growlerContentElement.style.filter = `alpha(opacity= ${op * 100} )`;
				requestAnimationFrame(fadeOut);
			}
		};
		fadeOut();
	}

	_bindCloseRequestListeners() {
		// trigger closeRequest on ESC key press
		document.addEventListener("keyup", this._triggerOnCloseRequestOnEscKeyPress, false);
	}

	_removeCloseRequestListeners() {
		document.removeEventListener("keyup", this._triggerOnCloseRequestOnEscKeyPress, false);
	}

	_triggerOnCloseRequestOnEscKeyPress(e) {
		if (e.keyCode === 27) {
			this._fadeOutGrowler();
		}
	}

	_createGrowlerContainer() {
		// Create content element
		this._growlerContentElement = document.createElement("div");
		this._growlerContentElement.style.display = "block";
		this._growlerContentElement.style.margin = "0 auto";
		this._growlerContentElement.style.position = "fixed";
		this._growlerContentElement.style.borderRadius = "10px";
		this._growlerContentElement.style.top = "60px"; // allow user to change this position value
		this._growlerContentElement.style.right = "30px"; // allow user to change this position value
		this._growlerContentElement.style.transform = HIDDEN_GROWLER_CONTENT_TRANSFORM;
		this._growlerContentElement.style.transition = "transform 0.28s ease-in";
		this._growlerContentElement.style.background = "black";
		this._growlerContentElement.style.color = "white";
		this._growlerContentElement.style.opacity = 0.7;
		this._growlerContentElement.style.width = "30%";
		this._growlerContentElement.style.maxWidth = "750px";

		// Append growler layer to DOM
		this._cachedBodyElementReference = this._cachedBodyElementReference || document.body;

		requestAnimationFrame(() => {
			this._cachedBodyElementReference.appendChild(this._growlerContentElement);
		})
	}

	_renderGrowlerContent() {
		if (this.props.open) {
			ReactDOM.render(
				<GrowlerContentWrapper style={this.props.style} key={"growler-content-wrapper"}>
					{this.props.children}
				</GrowlerContentWrapper>,
				this._growlerContentElement
			);
		}
		else if (!this.props.open && this._growlerContentElement) {
			ReactDOM.unmountComponentAtNode(this._growlerContentElement);
		}
	}

	render() {
		return null;
	}
}

Growler.displayName = "Growler";

Growler.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]),
	open: PropTypes.bool,
	listenForExternalCloseEvent: PropTypes.bool,
	onCloseRequest: PropTypes.func,
	timeToClose: PropTypes.number
};

Growler.defaultProps = {
	open: false,
	listenForExternalCloseEvent: true,
	onCloseRequest: function() {},
	timeToClose: null
};
