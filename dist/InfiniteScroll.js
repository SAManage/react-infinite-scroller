'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfiniteScroll = function (_Component) {
    _inherits(InfiniteScroll, _Component);

    function InfiniteScroll(props) {
        _classCallCheck(this, InfiniteScroll);

        var _this = _possibleConstructorReturn(this, (InfiniteScroll.__proto__ || Object.getPrototypeOf(InfiniteScroll)).call(this, props));

        _this.attachedScroller = false;
        _this.scrollListener = _this.scrollListener.bind(_this);
        return _this;
    }

    _createClass(InfiniteScroll, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.pageLoaded = this.props.pageStart;
            if (this.props.hasMore) this.attachScrollListener();
            if (this.props.initialLoad) {
                this.props.loadMore(this.pageLoaded);
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var newItemsCount = nextProps.totalItemsCount || nextProps.children.length;
            var oldItemsCount = this.props.totalItemsCount || this.props.children.length;
            if (newItemsCount !== oldItemsCount || nextProps.hasMore) {
                this.attachScrollListener();
            }
            if (nextProps.resetPageLoader && !this.props.resetPageLoader) {
                this.attachScrollListener();
                this.pageLoaded = this.props.pageStart;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                element = _props.element,
                hasMore = _props.hasMore,
                initialLoad = _props.initialLoad,
                loader = _props.loader,
                loadMore = _props.loadMore,
                pageStart = _props.pageStart,
                threshold = _props.threshold,
                useWindow = _props.useWindow,
                totalItemsCount = _props.totalItemsCount,
                resetPageLoader = _props.resetPageLoader,
                props = _objectWithoutProperties(_props, ['children', 'element', 'hasMore', 'initialLoad', 'loader', 'loadMore', 'pageStart', 'threshold', 'useWindow', 'totalItemsCount', 'resetPageLoader']);

            return _react2.default.createElement(element, props, children, hasMore && (loader || this._defaultLoader));
        }
    }, {
        key: 'calculateTopPosition',
        value: function calculateTopPosition(el) {
            if (!el) {
                return 0;
            }
            return el.offsetTop + this.calculateTopPosition(el.offsetParent);
        }
    }, {
        key: 'scrollListener',
        value: function scrollListener() {
            var el = _reactDom2.default.findDOMNode(this);
            var scrollEl = window;

            var offset = void 0;
            if (this.props.useWindow) {
                var scrollTop = scrollEl.pageYOffset !== undefined ? scrollEl.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                offset = this.calculateTopPosition(el) + el.offsetHeight - scrollTop - window.innerHeight;
            } else {
                offset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight;
            }

            if (offset < Number(this.props.threshold)) {
                if (typeof this.props.loadMore == 'function') {
                    this.props.loadMore(this.pageLoaded += 1);
                }
                // Call loadMore after detachScrollListener to allow for non-async loadMore functions to run
                // I changed the location of the detachScrollListener because loadMore called twice
                this.detachScrollListener();
            }
        }
    }, {
        key: 'attachScrollListener',
        value: function attachScrollListener() {
            if (this.attachedScroller) return;

            this.attachedScroller = true;
            var scrollEl = window;
            if (this.props.useWindow == false) {
                scrollEl = _reactDom2.default.findDOMNode(this).parentNode;
            }

            scrollEl.addEventListener('scroll', this.scrollListener);
            scrollEl.addEventListener('resize', this.scrollListener);
        }
    }, {
        key: 'detachScrollListener',
        value: function detachScrollListener() {
            var scrollEl = window;
            if (this.props.useWindow == false) {
                scrollEl = _reactDom2.default.findDOMNode(this).parentNode;
            }
            this.attachedScroller = false;
            scrollEl.removeEventListener('scroll', this.scrollListener);
            scrollEl.removeEventListener('resize', this.scrollListener);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.detachScrollListener();
        }

        // Set a defaut loader for all your `InfiniteScroll` components

    }, {
        key: 'setDefaultLoader',
        value: function setDefaultLoader(loader) {
            this._defaultLoader = loader;
        }
    }]);

    return InfiniteScroll;
}(_react.Component);

InfiniteScroll.propTypes = {
    element: _react.PropTypes.string,
    hasMore: _react.PropTypes.bool,
    initialLoad: _react.PropTypes.bool,
    loadMore: _react.PropTypes.func.isRequired,
    pageStart: _react.PropTypes.number,
    threshold: _react.PropTypes.number,
    useWindow: _react.PropTypes.bool,
    resetPageLoader: _react.PropTypes.bool
};
InfiniteScroll.defaultProps = {
    element: 'div',
    hasMore: false,
    initialLoad: true,
    pageStart: 0,
    threshold: 250,
    useWindow: true,
    resetPageLoader: false
};
exports.default = InfiniteScroll;
module.exports = exports['default'];
