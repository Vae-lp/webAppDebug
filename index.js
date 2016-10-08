/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Debugger = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by didi on 16/9/21.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _debuggerjs = __webpack_require__(1);

	var _debuggerjs2 = _interopRequireDefault(_debuggerjs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DebuggerInstance = function () {
	    function DebuggerInstance(error) {
	        _classCallCheck(this, DebuggerInstance);

	        this.error = {};
	        this.style = {};
	        this.instance = null;

	        this.getErrorObj(error);
	        this.create();
	    }

	    _createClass(DebuggerInstance, [{
	        key: 'create',
	        value: function create() {
	            var me = this;
	            var error = me.error;
	            var count = Debugger.errorCount;
	            var timeStamp = +new Date();

	            var content = '\n            <div >err' + count + ': ' + error.message + '<br/>location: ' + error.location + '</div>\n            ';
	            var alertBox = document.createElement('div');
	            alertBox.id = 'debugger-' + timeStamp;
	            alertBox.className = _debuggerjs2.default.debugger;
	            alertBox.innerHTML = content;

	            me.instance = alertBox;

	            document.body.appendChild(alertBox);

	            Debugger.errorCount++;

	            setTimeout(function () {
	                me.destroy();
	            }, 10000);
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var me = this;
	            me.blur().then(function () {
	                var instance = me.instance;
	                instance && instance.parentNode && instance.parentNode.removeChild(instance);
	            });
	        }
	    }, {
	        key: 'blur',
	        value: function blur() {
	            var me = this,
	                instance = this.instance,
	                timer = null;

	            return new Promise(function (res, rej) {
	                timer = setInterval(function () {
	                    var opacity = me.getCssValue(instance, 'opacity');
	                    if (opacity < 0.1) {
	                        clearTimeout(timer);
	                        res();
	                    } else {
	                        instance.style.opacity = opacity - 0.1;
	                    }
	                }, 50);
	            });
	        }
	    }, {
	        key: 'getErrorObj',
	        value: function getErrorObj(arg) {
	            this.error = arg;
	        }
	    }, {
	        key: 'getCssValue',
	        value: function getCssValue(target, attr) {
	            return window.getComputedStyle(target)[attr];
	        }
	    }, {
	        key: 'compileToCss',
	        value: function compileToCss(obj) {
	            var cssText = '';
	            for (var key in obj) {
	                var cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
	                var cssVal = obj[key];
	                cssText += cssKey + ':' + cssVal + ';';
	            }

	            return cssText;
	        }
	    }]);

	    return DebuggerInstance;
	}();

	var Debugger = exports.Debugger = {

	    errorCount: 1,

	    init: function init() {
	        this.listenScriptError();
	    },
	    listenScriptError: function listenScriptError() {
	        var me = this;
	        window.addEventListener('error', function () {
	            me.log(arguments[0]);
	        });
	    },
	    log: function log(error) {

	        var me = this;

	        if (me.isError(error)) {

	            error.message = me.getStackMessage(error.stack);
	            error.location = me.getStackLocation(error.stack);
	            new DebuggerInstance(error);
	        } else if (me.isEvent(error)) {
	            me.throwError().then(function (e) {
	                var target = error.target;
	                error.message = "Resource Error: can't get " + (target.src || target.href) + ".";
	                error.location = me.getStackLocation(e.stack);
	                new DebuggerInstance(error);
	            });
	        } else if (me.isErrorEvent(error)) {

	            error.location = me.getStackLocation(error.error.stack);
	            new DebuggerInstance(error);
	        } else if (me.isXHR(error)) {

	            me.throwError().then(function (e) {
	                error.message = "AJAX Error: XMLHttpRequest failed. Did you use $.ajax? the Debugger can't get more detail from error callback. Please check your $.ajax settings.";
	                error.location = me.getStackLocation(e.stack);
	                new DebuggerInstance(error);
	            });
	        } else if (me.isString(error)) {
	            me.throwError().then(function (e) {
	                new DebuggerInstance({
	                    message: error,
	                    location: me.getStackLocation(e.stack) });
	            });
	        } else if (me.isUndefined(error)) {
	            me.throwError().then(function (e) {
	                error.message = "Params Error: Debugger.log(...) must have 1 param in it, but found none";
	                error.location = me.getStackLocation(e.stack);
	                new DebuggerInstance(error);
	            });
	        } else {
	            me.throwError().then(function (e) {
	                error.message = "Unknown Error.";
	                error.location = me.getStackLocation(e.stack);
	                new DebuggerInstance(error);
	            });
	        }
	    },
	    throwError: function throwError() {
	        return new Promise(function (res, rej) {
	            try {
	                throw new Error();
	            } catch (e) {
	                res(e);
	            }
	        });
	    },
	    getStackMessage: function getStackMessage(stack) {
	        var stackArr = stack.split(/\n+/);
	        return stackArr[0].replace(/(^\s+|\s+$)/, "");
	    },
	    getStackLocation: function getStackLocation(stack) {
	        console.log(stack);
	        var stackArr = stack.split(/\n+/);
	        return stackArr[stackArr.length - 1].replace(/(^\s+|\s+$)/, "");
	    },
	    isError: function isError(error) {
	        return error instanceof Error;
	    },
	    isEvent: function isEvent(error) {
	        return error.constructor === Event;
	    },
	    isErrorEvent: function isErrorEvent(error) {
	        return error.constructor === ErrorEvent;
	    },
	    isProgressEvent: function isProgressEvent(error) {
	        return error.constructor === ProgressEvent;
	    },
	    isXHR: function isXHR(error) {
	        return error.constructor === XMLHttpRequest;
	    },
	    isString: function isString(error) {
	        return Object.prototype.toString.call(error) === "[object String]";
	    },
	    isUndefined: function isUndefined(error) {
	        return Object.prototype.toString.call(error) === "[object Undefined]";
	    }
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/.npminstall/css-loader/0.25.0/css-loader/index.js?modules&localIdentName=[name]-[hash:base64:5]!./../node_modules/.npminstall/less-loader/2.2.3/less-loader/index.js!./debuggerjs.less", function() {
				var newContent = require("!!./../node_modules/.npminstall/css-loader/0.25.0/css-loader/index.js?modules&localIdentName=[name]-[hash:base64:5]!./../node_modules/.npminstall/less-loader/2.2.3/less-loader/index.js!./debuggerjs.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".debuggerjs-3zzvy {\n  position: relative;\n  opacity: 1;\n  word-wrap: break-word;\n}\n.debuggerjs-3zzvy div {\n  background: rgba(0, 0, 0, 0.6);\n  font-size: 1rem;\n  color: #fff;\n  line-height: 1.2;\n  padding: 0.5rem 10% 0.5rem 0.5rem;\n  border-bottom: 1px solid #f0f0f0;\n}\n.debuggerjs-3zzvy div span {\n  position: absolute;\n  top: .2rem;\n  right: .2rem;\n  font-size: 2rem;\n  width: 12px;\n  height: 24px;\n  background: #f0f0f0;\n  padding: 0 0.4rem;\n  color: rgba(0, 0, 0, 0.6);\n}\n.debuggerjs-3zzvy div span::before,\n.debuggerjs-3zzvy div span::after {\n  content: '';\n  position: absolute;\n  height: 2px;\n  width: 100%;\n  top: 50%;\n  left: 0;\n  margin-top: -1px;\n  background: #000;\n}\n.debuggerjs-3zzvy div span::before {\n  -webkit-transform: rotate(45deg);\n  -moz-transform: rotate(45deg);\n  -ms-transform: rotate(45deg);\n  -o-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n.debuggerjs-3zzvy div span::after {\n  -webkit-transform: rotate(-45deg);\n  -moz-transform: rotate(-45deg);\n  -ms-transform: rotate(-45deg);\n  -o-transform: rotate(-45deg);\n  transform: rotate(-45deg);\n}\n", ""]);

	// exports
	exports.locals = {
		"debugger": "debuggerjs-3zzvy"
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);