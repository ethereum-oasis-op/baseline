(function (e, a) {
  for (var i in a) e[i] = a[i];
})(
  exports,
  /******/ (function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {}; // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/
      } // Create a new module (and put it into the cache)
      /******/ /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {},
        /******/
      }); // Execute the module function
      /******/
      /******/ /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ); // Flag the module as loaded
      /******/
      /******/ /******/ module.l = true; // Return the exports of the module
      /******/
      /******/ /******/ return module.exports;
      /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules; // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function (exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter,
        });
        /******/
      }
      /******/
    }; // define __esModule on exports
    /******/
    /******/ /******/ __webpack_require__.r = function (exports) {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
    /******/
    /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function (
      value,
      mode
    ) {
      /******/ if (mode & 1) value = __webpack_require__(value);
      /******/ if (mode & 8) return value;
      /******/ if (
        mode & 4 &&
        typeof value === "object" &&
        value &&
        value.__esModule
      )
        return value;
      /******/ var ns = Object.create(null);
      /******/ __webpack_require__.r(ns);
      /******/ Object.defineProperty(ns, "default", {
        enumerable: true,
        value: value,
      });
      /******/ if (mode & 2 && typeof value != "string")
        for (var key in value)
          __webpack_require__.d(
            ns,
            key,
            function (key) {
              return value[key];
            }.bind(null, key)
          );
      /******/ return ns;
      /******/
    }; // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function (module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module["default"];
            }
          : /******/ function getModuleExports() {
              return module;
            };
      /******/ __webpack_require__.d(getter, "a", getter);
      /******/ return getter;
      /******/
    }; // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    }; // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
    /******/
    /******/
    /******/ /******/ return __webpack_require__((__webpack_require__.s = 13));
    /******/
  })(
    /************************************************************************/
    /******/ [
      /* 0 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        const X12SegmentHeader_1 = __webpack_require__(1);
        const os = __webpack_require__(14);
        /**
         * @description Set default values for any missing X12SerializationOptions in an options object.
         * @param {X12SerializationOptions} [options] - Options for serializing to and from EDI.
         * @param {boolean} [canOverwrite] - Configure if this options can be overwritten.
         * @returns {X12SerializationOptions} Serialization options with defaults filled in.
         */
        function defaultSerializationOptions(options, canOverwrite = true) {
          options = options === undefined ? {} : options;
          options.elementDelimiter =
            options.elementDelimiter === undefined
              ? "*"
              : options.elementDelimiter;
          options.endOfLine =
            options.endOfLine === undefined ? os.EOL : options.endOfLine;
          options.format =
            options.format === undefined ? false : options.format;
          options.segmentTerminator =
            options.segmentTerminator === undefined
              ? "~"
              : options.segmentTerminator;
          options.subElementDelimiter =
            options.subElementDelimiter === undefined
              ? ">"
              : options.subElementDelimiter;
          options.repetitionDelimiter =
            options.repetitionDelimiter === undefined
              ? "^"
              : options.repetitionDelimiter;
          options.segmentHeaders =
            options.segmentHeaders === undefined
              ? X12SegmentHeader_1.StandardSegmentHeaders
              : options.segmentHeaders;
          options.canOverwrite = canOverwrite;
          if (options.segmentTerminator === "\n") {
            options.endOfLine = "";
          }
          return options;
        }
        exports.defaultSerializationOptions = defaultSerializationOptions;

        /***/
      },
      /* 1 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        var X12SegmentHeaderLoopStyle;
        (function (X12SegmentHeaderLoopStyle) {
          X12SegmentHeaderLoopStyle["Bounded"] = "bounded";
          X12SegmentHeaderLoopStyle["Unbounded"] = "unbounded";
        })(
          (X12SegmentHeaderLoopStyle =
            exports.X12SegmentHeaderLoopStyle ||
            (exports.X12SegmentHeaderLoopStyle = {}))
        );
        exports.ISASegmentHeader = {
          tag: "ISA",
          trailer: "IEA",
          layout: {
            ISA01: 2,
            ISA02: 10,
            ISA03: 2,
            ISA04: 10,
            ISA05: 2,
            ISA06: 15,
            ISA07: 2,
            ISA08: 15,
            ISA09: 6,
            ISA10: 4,
            ISA11: 1,
            ISA12: 5,
            ISA13: 9,
            ISA14: 1,
            ISA15: 1,
            ISA16: 1,
            COUNT: 16,
            PADDING: true,
          },
          loopStyle: X12SegmentHeaderLoopStyle.Bounded,
        };
        exports.GSSegmentHeader = {
          tag: "GS",
          trailer: "GE",
          layout: {
            GS01: 2,
            GS02: 15,
            GS02_MIN: 2,
            GS03: 15,
            GS03_MIN: 2,
            GS04: 8,
            GS05: 8,
            GS05_MIN: 4,
            GS06: 9,
            GS06_MIN: 1,
            GS07: 2,
            GS07_MIN: 1,
            GS08: 12,
            GS08_MIN: 1,
            COUNT: 8,
            PADDING: false,
          },
          loopStyle: X12SegmentHeaderLoopStyle.Bounded,
        };
        exports.STSegmentHeader = {
          tag: "ST",
          trailer: "SE",
          layout: {
            ST01: 3,
            ST02: 9,
            ST02_MIN: 4,
            COUNT: 2,
            PADDING: false,
          },
          loopStyle: X12SegmentHeaderLoopStyle.Bounded,
          loopIdIndex: 1,
        };
        exports.LSSegmentHeader = {
          tag: "LS",
          trailer: "LE",
          layout: {
            LS01: 4,
            LS01_MIN: 1,
            COUNT: 1,
            PADDING: false,
          },
          loopStyle: X12SegmentHeaderLoopStyle.Bounded,
          loopIdIndex: 1,
          loopNoUnboundedChildren: true,
        };
        exports.LESegmentHeader = {
          tag: "LE",
          layout: {
            LS01: 4,
            LS01_MIN: 1,
            COUNT: 1,
            PADDING: false,
          },
        };
        exports.HLSegmentHeader = {
          tag: "HL",
          layout: {
            HL01: 12,
            HL01_MIN: 1,
            HL02: 12,
            HL03: 2,
            HL03_MIN: 1,
            HL04: 1,
            COUNT: 4,
            PADDING: false,
          },
          loopStyle: X12SegmentHeaderLoopStyle.Unbounded,
          loopIdIndex: 3,
        };
        exports.StandardSegmentHeaders = [
          exports.ISASegmentHeader,
          exports.GSSegmentHeader,
          exports.STSegmentHeader,
          exports.HLSegmentHeader,
          exports.LSSegmentHeader,
          exports.LESegmentHeader,
        ];

        /***/
      },
      /* 2 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        class JSEDINotation {
          constructor(header, options) {
            this.header = header === undefined ? new Array() : header;
            this.options = options === undefined ? {} : options;
            this.functionalGroups = new Array();
          }
          addFunctionalGroup(header) {
            const functionalGroup = new JSEDIFunctionalGroup(header);
            this.functionalGroups.push(functionalGroup);
            return functionalGroup;
          }
        }
        exports.JSEDINotation = JSEDINotation;
        class JSEDIFunctionalGroup {
          constructor(header) {
            this.header = header === undefined ? new Array() : header;
            this.transactions = new Array();
          }
          addTransaction(header) {
            const transaction = new JSEDITransaction(header);
            this.transactions.push(transaction);
            return transaction;
          }
        }
        exports.JSEDIFunctionalGroup = JSEDIFunctionalGroup;
        class JSEDITransaction {
          constructor(header) {
            this.header = header === undefined ? new Array() : header;
            this.segments = new Array();
          }
          addSegment(tag, elements) {
            const segment = new JSEDISegment(tag, elements);
            this.segments.push(segment);
            return segment;
          }
        }
        exports.JSEDITransaction = JSEDITransaction;
        class JSEDISegment {
          constructor(tag, elements) {
            this.tag = tag;
            this.elements = elements;
          }
        }
        exports.JSEDISegment = JSEDISegment;

        /***/
      },
      /* 3 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        const JSEDINotation_1 = __webpack_require__(2);
        const Positioning_1 = __webpack_require__(8);
        const X12Element_1 = __webpack_require__(7);
        const X12SerializationOptions_1 = __webpack_require__(0);
        const X12SegmentHeader_1 = __webpack_require__(1);
        const Errors_1 = __webpack_require__(4);
        class X12Segment {
          /**
           * @description Create a segment.
           * @param {string} tag - The tag for this segment.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          constructor(tag = "", options) {
            this.tag = tag;
            this.elements = new Array();
            this.range = new Positioning_1.Range();
            this.options = X12SerializationOptions_1.defaultSerializationOptions(
              options,
              false
            );
            this.parseIndex = -1;
          }
          /**
           * @description Set the elements of this segment.
           * @param {string[]} values - An array of element values.
           */
          setElements(values) {
            this._formatValues(values);
            this.elements = new Array();
            values.forEach((value) => {
              this.elements.push(new X12Element_1.X12Element(value));
            });
          }
          /**
           * @description Add an element to this segment.
           * @param {string} value - A string value.
           * @returns {X12Element} The element that was added to this segment.
           */
          addElement(value = "") {
            const element = new X12Element_1.X12Element(value);
            this.elements.push(element);
            return element;
          }
          /**
           * @description Replace an element at a position in the segment.
           * @param {string} value - A string value.
           * @param {number} segmentPosition - A 1-based number indicating the position in the segment.
           * @returns {X12Element} The new element if successful, or a null if failed.
           */
          replaceElement(value, segmentPosition) {
            const index = segmentPosition - 1;
            if (this.elements.length <= index) {
              return null;
            } else {
              this.elements[index] = new X12Element_1.X12Element(value);
            }
            return this.elements[index];
          }
          /**
           * @description Insert an element at a position in the segment.
           * @param {string} value - A string value.
           * @param {number} segmentPosition - A 1-based number indicating the position in the segment.
           * @returns {X12Element} The new element if successful, or a null if failed.
           */
          insertElement(value = "", segmentPosition = 1) {
            const index = segmentPosition - 1;
            if (this.elements.length <= index) {
              return null;
            }
            return (
              this.elements.splice(index, 0, new X12Element_1.X12Element(value))
                .length === 1
            );
          }
          /**
           * @description Remove an element at a position in the segment.
           * @param {number} segmentPosition - A 1-based number indicating the position in the segment.
           * @returns {boolean} True if successful.
           */
          removeElement(segmentPosition) {
            const index = segmentPosition - 1;
            if (this.elements.length <= index) {
              return false;
            }
            return this.elements.splice(index, 1).length === 1;
          }
          /**
           * @description Get the value of an element in this segment.
           * @param {number} segmentPosition - A 1-based number indicating the position in the segment.
           * @param {string} [defaultValue] - A default value to return if there is no element found.
           * @returns {string} If no element is at this position, null or the default value will be returned.
           */
          valueOf(segmentPosition, defaultValue) {
            const index = segmentPosition - 1;
            if (this.elements.length <= index) {
              return defaultValue === undefined ? null : defaultValue;
            }
            return this.elements[index].value === undefined
              ? defaultValue === undefined
                ? null
                : defaultValue
              : this.elements[index].value;
          }
          /**
           * @description Serialize segment to EDI string.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           * @returns {string} This segment converted to an EDI string.
           */
          toString(options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            let edi = this.tag;
            for (let i = 0; i < this.elements.length; i++) {
              edi += options.elementDelimiter;
              if (
                (this.tag === "ISA" && i === 12) ||
                (this.tag === "IEA" && i === 1)
              ) {
                edi += String.prototype.padStart.call(
                  this.elements[i].value,
                  9,
                  "0"
                );
              } else {
                edi += this.elements[i].value;
              }
            }
            edi += options.segmentTerminator;
            return edi;
          }
          /**
           * @description Serialize transaction set to JSON object.
           * @returns {object} This segment converted to an object.
           */
          toJSON() {
            return new JSEDINotation_1.JSEDISegment(
              this.tag,
              this.elements.map((x) => x.value)
            );
          }
          /**
           * @description Gets the segement header.
           * @returns {X12SegmentHeader} A header if defined otherwise undefined.
           */
          getHeader() {
            if (this._checkSupportedSegment()) {
              const match = this.options.segmentHeaders.find((sh) => {
                return sh.tag === this.tag;
              });
              if (match !== undefined) {
                return match;
              } else {
                throw Error(
                  `Unable to find segment header for tag '${this.tag}' even though it should be support`
                );
              }
            } else {
              return undefined;
            }
          }
          /**
           * @private
           * @description Check to see if segment is predefined.
           * @returns {boolean} True if segment is predefined.
           */
          _checkSupportedSegment() {
            return (
              this.options.segmentHeaders.findIndex((sh) => {
                return sh.tag === this.tag;
              }) > -1
            );
          }
          /**
           * @private
           * @description Get the definition of this segment.
           * @returns {object} The definition of this segment.
           */
          _getX12Enumerable() {
            const match = this.options.segmentHeaders.find((sh) => {
              return sh.tag === this.tag;
            });
            if (match !== undefined) {
              return match.layout;
            } else {
              throw Error(
                `Unable to find segment header for tag '${this.tag}' even though it should be support`
              );
            }
          }
          /**
           * @private
           * @description Format and validate the element values according the segment definition.
           * @param {string[]} values - An array of element values.
           */
          _formatValues(values) {
            if (this._checkSupportedSegment()) {
              const enumerable = this._getX12Enumerable();
              if (
                this.tag === X12SegmentHeader_1.ISASegmentHeader.tag &&
                this.options.subElementDelimiter.length === 1
              ) {
                values[15] = this.options.subElementDelimiter;
              }
              if (values.length === enumerable.COUNT) {
                for (let i = 0; i < values.length; i++) {
                  const name = `${this.tag}${String.prototype.padStart.call(
                    i + 1,
                    2,
                    "0"
                  )}`;
                  const max = enumerable[name];
                  const min =
                    enumerable[`${name}_MIN`] === undefined
                      ? 0
                      : enumerable[`${name}_MIN`];
                  values[i] = `${values[i]}`;
                  if (values[i].length > max && values[i].length !== 0) {
                    throw new Errors_1.GeneratorError(
                      `Segment element "${name}" with value of "${values[i]}" exceeds maximum of ${max} characters.`
                    );
                  }
                  if (values[i].length < min && values[i].length !== 0) {
                    throw new Errors_1.GeneratorError(
                      `Segment element "${name}" with value of "${values[i]}" does not meet minimum of ${min} characters.`
                    );
                  }
                  if (
                    enumerable.PADDING &&
                    ((values[i].length < max && values[i].length > min) ||
                      values[i].length === 0)
                  ) {
                    if (name === "ISA13") {
                      values[i] = String.prototype.padStart.call(
                        values[i],
                        max,
                        "0"
                      );
                    } else {
                      values[i] = String.prototype.padEnd.call(
                        values[i],
                        max,
                        " "
                      );
                    }
                  }
                }
              } else {
                throw new Errors_1.GeneratorError(
                  `Segment "${this.tag}" with ${values.length} elements does meet the required count of ${enumerable.COUNT}.`
                );
              }
            }
          }
        }
        exports.X12Segment = X12Segment;

        /***/
      },
      /* 4 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        class ArgumentNullError extends Error {
          constructor(argumentName) {
            super(`The argument, '${argumentName}', cannot be null.`);
            this.name = "ArgumentNullError";
          }
        }
        exports.ArgumentNullError = ArgumentNullError;
        class GeneratorError extends Error {
          constructor(message) {
            super(message);
            this.name = "GeneratorError";
          }
        }
        exports.GeneratorError = GeneratorError;
        class ParserError extends Error {
          constructor(message) {
            super(message);
            this.name = "ParserError";
          }
        }
        exports.ParserError = ParserError;
        class QuerySyntaxError extends Error {
          constructor(message) {
            super(message);
            this.name = "QuerySyntaxError";
          }
        }
        exports.QuerySyntaxError = QuerySyntaxError;

        /***/
      },
      /* 5 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        const JSEDINotation_1 = __webpack_require__(2);
        const X12Segment_1 = __webpack_require__(3);
        const X12SegmentHeader_1 = __webpack_require__(1);
        const X12TransactionMap_1 = __webpack_require__(11);
        const X12SerializationOptions_1 = __webpack_require__(0);
        class X12Transaction {
          /**
           * @description Create a transaction set.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          constructor(options) {
            this.segments = new Array();
            this.options = X12SerializationOptions_1.defaultSerializationOptions(
              options
            );
          }
          /**
           * @description Set a ST header on this transaction set.
           * @param {string[]} elements - An array of elements for a ST header.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          setHeader(elements, options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(
                    options,
                    false
                  )
                : this.options;
            this.header = new X12Segment_1.X12Segment(
              X12SegmentHeader_1.STSegmentHeader.tag,
              options
            );
            this.header.setElements(elements);
            this._setTrailer(options);
          }
          /**
           * @description Add a segment to this transaction set.
           * @param {string} tag - The tag for this segment.
           * @param {string[]} elements - An array of elements for this segment.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           * @returns {X12Segment} The segment added to this transaction set.
           */
          addSegment(tag, elements, options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            const segment = new X12Segment_1.X12Segment(tag, options);
            segment.setElements(elements);
            this.segments.push(segment);
            this.trailer.replaceElement(`${this.segments.length + 2}`, 1);
            return segment;
          }
          /**
           * @description Map data from a javascript object to this transaction set.
           * @param {object} input - The input object to create the transaction from.
           * @param {object} map - The javascript object containing keys and querys to resolve.
           * @param {object} [macro] - A macro object to add or override methods for the macro directive; properties 'header' and 'segments' are reserved words.
           */
          fromObject(input, map, macro) {
            const mapper = new X12TransactionMap_1.X12TransactionMap(map, this);
            mapper.fromObject(input, macro);
          }
          /**
           * @description Map data from a transaction set to a javascript object.
           * @param {object} map - The javascript object containing keys and querys to resolve.
           * @param {Function} helper - A helper function which will be executed on every resolved query value.
           * @returns {object} An object containing resolved values mapped to object keys.
           */
          toObject(map, helper) {
            const mapper = new X12TransactionMap_1.X12TransactionMap(
              map,
              this,
              helper
            );
            return mapper.toObject();
          }
          /**
           * @description Serialize transaction set to EDI string.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           * @returns {string} This transaction set converted to an EDI string.
           */
          toString(options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            let edi = this.header.toString(options);
            if (options.format) {
              edi += options.endOfLine;
            }
            for (let i = 0; i < this.segments.length; i++) {
              edi += this.segments[i].toString(options);
              if (options.format) {
                edi += options.endOfLine;
              }
            }
            edi += this.trailer.toString(options);
            return edi;
          }
          /**
           * @description Serialize transaction set to JSON object.
           * @returns {object} This transaction set converted to an object.
           */
          toJSON() {
            const jsen = new JSEDINotation_1.JSEDITransaction(
              this.header.elements.map((x) => x.value)
            );
            this.segments.forEach((segment) => {
              jsen.addSegment(
                segment.tag,
                segment.elements.map((x) => x.value)
              );
            });
            return jsen;
          }
          /**
           * @private
           * @description Set a SE trailer on this transaction set.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          _setTrailer(options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            this.trailer = new X12Segment_1.X12Segment(
              X12SegmentHeader_1.STSegmentHeader.trailer,
              options
            );
            this.trailer.setElements([
              `${this.segments.length + 2}`,
              this.header.valueOf(2),
            ]);
          }
        }
        exports.X12Transaction = X12Transaction;

        /***/
      },
      /* 6 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        const JSEDINotation_1 = __webpack_require__(2);
        const X12FunctionalGroup_1 = __webpack_require__(9);
        const X12Segment_1 = __webpack_require__(3);
        const X12SegmentHeader_1 = __webpack_require__(1);
        const X12SerializationOptions_1 = __webpack_require__(0);
        class X12Interchange {
          /**
           * @description Create an interchange.
           * @param {string|X12SerializationOptions} [segmentTerminator] - A character to terminate segments when serializing; or an instance of X12SerializationOptions.
           * @param {string} [elementDelimiter] - A character to separate elements when serializing; only required when segmentTerminator is a character.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          constructor(segmentTerminator, elementDelimiter, options) {
            this.functionalGroups = new Array();
            if (typeof segmentTerminator === "string") {
              this.segmentTerminator = segmentTerminator;
              if (typeof elementDelimiter === "string") {
                this.elementDelimiter = elementDelimiter;
              } else {
                throw new TypeError(
                  'Parameter "elementDelimiter" must be type of string.'
                );
              }
            } else {
              this.options = X12SerializationOptions_1.defaultSerializationOptions(
                segmentTerminator
              );
              this.segmentTerminator = this.options.segmentTerminator;
              this.elementDelimiter = this.options.elementDelimiter;
            }
            if (this.options === undefined) {
              this.options = X12SerializationOptions_1.defaultSerializationOptions(
                options
              );
            }
          }
          /**
           * @description Set an ISA header on this interchange.
           * @param {string[]} elements - An array of elements for an ISA header.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          setHeader(elements, options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            this.header = new X12Segment_1.X12Segment(
              X12SegmentHeader_1.ISASegmentHeader.tag,
              options
            );
            this.header.setElements(elements);
            this._setTrailer(options);
          }
          /**
           * @description Add a functional group to this interchange.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           * @returns {X12FunctionalGroup} The functional group added to this interchange.
           */
          addFunctionalGroup(options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            const functionalGroup = new X12FunctionalGroup_1.X12FunctionalGroup(
              options
            );
            this.functionalGroups.push(functionalGroup);
            this.trailer.replaceElement(`${this.functionalGroups.length}`, 1);
            return functionalGroup;
          }
          /**
           * @description Serialize interchange to EDI string.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           * @returns {string} This interchange converted to an EDI string.
           */
          toString(options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            let edi = this.header.toString(options);
            if (options.format) {
              edi += options.endOfLine;
            }
            for (let i = 0; i < this.functionalGroups.length; i++) {
              edi += this.functionalGroups[i].toString(options);
              if (options.format) {
                edi += options.endOfLine;
              }
            }
            edi += this.trailer.toString(options);
            return edi;
          }
          /**
           * @description Get a list of the parsed segment loops.
           * @param {boolean} [textOnly] - Return just a text list for output dislay, default is true.
           * If false will return a list of detailed objects.
           * @returns {any[]} A string list of segment loops.
           */
          getSegmentLoops(textOnly = true) {
            const segmentLoops = [];
            this.functionalGroups.forEach((fg) => {
              fg.transactions.forEach((t) => {
                t.segments.forEach((s) => {
                  if (s.loopPath !== undefined) {
                    if (textOnly === true) {
                      segmentLoops.push(
                        `${s.loopPath} - ${s.tag}(${s.parseIndex})`
                      );
                    } else {
                      segmentLoops.push({
                        tag: s.tag,
                        loopPath: s.loopPath,
                        loopIndex: s.loopIndex,
                        parseIndex: s.parseIndex,
                      });
                    }
                  }
                });
              });
            });
            return segmentLoops;
          }
          /**
           * @description Serialize interchange to JS EDI Notation object.
           * @returns {JSEDINotation} This interchange converted to JS EDI Notation object.
           */
          toJSEDINotation() {
            const jsen = new JSEDINotation_1.JSEDINotation(
              this.header.elements.map((x) => x.value.trim()),
              this.options
            );
            this.functionalGroups.forEach((functionalGroup) => {
              const jsenFunctionalGroup = jsen.addFunctionalGroup(
                functionalGroup.header.elements.map((x) => x.value)
              );
              functionalGroup.transactions.forEach((transaction) => {
                const jsenTransaction = jsenFunctionalGroup.addTransaction(
                  transaction.header.elements.map((x) => x.value)
                );
                transaction.segments.forEach((segment) => {
                  jsenTransaction.addSegment(
                    segment.tag,
                    segment.elements.map((x) => x.value)
                  );
                });
              });
            });
            return jsen;
          }
          /**
           * @description Serialize interchange to JSON object.
           * @returns {object} This interchange converted to an object.
           */
          toJSON() {
            return this.toJSEDINotation();
          }
          /**
           * @private
           * @description Set an ISA trailer on this interchange.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          _setTrailer(options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            this.trailer = new X12Segment_1.X12Segment(
              X12SegmentHeader_1.ISASegmentHeader.trailer,
              options
            );
            this.trailer.setElements([
              `${this.functionalGroups.length}`,
              this.header.valueOf(13),
            ]);
          }
        }
        exports.X12Interchange = X12Interchange;

        /***/
      },
      /* 7 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        const Positioning_1 = __webpack_require__(8);
        class X12Element {
          /**
           * @description Create an element.
           * @param {string} value - A value for this element.
           */
          constructor(value = "") {
            this.range = new Positioning_1.Range();
            this.value = value;
          }
        }
        exports.X12Element = X12Element;

        /***/
      },
      /* 8 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        class Position {
          constructor(line, character) {
            if (typeof line === "number" && typeof character === "number") {
              this.line = line;
              this.character = character;
            }
          }
        }
        exports.Position = Position;
        class Range {
          constructor(startLine, startChar, endLine, endChar) {
            if (
              typeof startLine === "number" &&
              typeof startChar === "number" &&
              typeof endLine === "number" &&
              typeof endChar === "number"
            ) {
              this.start = new Position(startLine, startChar);
              this.end = new Position(endLine, endChar);
            }
          }
        }
        exports.Range = Range;

        /***/
      },
      /* 9 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        const JSEDINotation_1 = __webpack_require__(2);
        const X12Segment_1 = __webpack_require__(3);
        const X12SegmentHeader_1 = __webpack_require__(1);
        const X12Transaction_1 = __webpack_require__(5);
        const X12SerializationOptions_1 = __webpack_require__(0);
        class X12FunctionalGroup {
          /**
           * @description Create a functional group.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          constructor(options) {
            this.transactions = new Array();
            this.options = X12SerializationOptions_1.defaultSerializationOptions(
              options
            );
          }
          /**
           * @description Set a GS header on this functional group.
           * @param {string[]} elements - An array of elements for a GS header.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          setHeader(elements, options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            this.header = new X12Segment_1.X12Segment(
              X12SegmentHeader_1.GSSegmentHeader.tag,
              options
            );
            this.header.setElements(elements);
            this._setTrailer(options);
          }
          /**
           * @description Add a transaction set to this functional group.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           * @returns {X12Transaction} The transaction which was added to this functional group.
           */
          addTransaction(options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            const transaction = new X12Transaction_1.X12Transaction(options);
            this.transactions.push(transaction);
            this.trailer.replaceElement(`${this.transactions.length}`, 1);
            return transaction;
          }
          /**
           * @description Serialize functional group to EDI string.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           * @returns {string} This functional group converted to EDI string.
           */
          toString(options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            let edi = this.header.toString(options);
            if (options.format) {
              edi += options.endOfLine;
            }
            for (let i = 0; i < this.transactions.length; i++) {
              edi += this.transactions[i].toString(options);
              if (options.format) {
                edi += options.endOfLine;
              }
            }
            edi += this.trailer.toString(options);
            return edi;
          }
          /**
           * @description Serialize functional group to JSON object.
           * @returns {object} This functional group converted to an object.
           */
          toJSON() {
            const jsen = new JSEDINotation_1.JSEDIFunctionalGroup(
              this.header.elements.map((x) => x.value)
            );
            this.transactions.forEach((transaction) => {
              const jsenTransaction = jsen.addTransaction(
                transaction.header.elements.map((x) => x.value)
              );
              transaction.segments.forEach((segment) => {
                jsenTransaction.addSegment(
                  segment.tag,
                  segment.elements.map((x) => x.value)
                );
              });
            });
            return jsen;
          }
          /**
           * @private
           * @description Set a GE trailer on this functional group.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          _setTrailer(options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            this.trailer = new X12Segment_1.X12Segment(
              X12SegmentHeader_1.GSSegmentHeader.trailer,
              options
            );
            this.trailer.setElements([
              `${this.transactions.length}`,
              this.header.valueOf(6),
            ]);
          }
        }
        exports.X12FunctionalGroup = X12FunctionalGroup;

        /***/
      },
      /* 10 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        const stream_1 = __webpack_require__(15);
        const string_decoder_1 = __webpack_require__(16);
        const Errors_1 = __webpack_require__(4);
        const Positioning_1 = __webpack_require__(8);
        const X12Diagnostic_1 = __webpack_require__(17);
        const X12FatInterchange_1 = __webpack_require__(18);
        const X12Interchange_1 = __webpack_require__(6);
        const X12FunctionalGroup_1 = __webpack_require__(9);
        const X12Transaction_1 = __webpack_require__(5);
        const X12Segment_1 = __webpack_require__(3);
        const X12Element_1 = __webpack_require__(7);
        const X12SerializationOptions_1 = __webpack_require__(0);
        const X12SegmentHeader_1 = __webpack_require__(1);
        const DOCUMENT_MIN_LENGTH = 113; // ISA = 106, IEA > 7
        const SEGMENT_TERMINATOR_POS = 105;
        const END_OF_LINE_POS = 106;
        const ELEMENT_DELIMITER_POS = 3;
        const SUBELEMENT_DELIMITER_POS = 104;
        const REPETITION_DELIMITER_POS = 82;
        // Legacy note: const INTERCHANGE_CACHE_SIZE: number = 10
        class X12Parser extends stream_1.Transform {
          /**
           * @description Factory for parsing EDI into interchange object.
           * @param {boolean|X12SerializationOptions} [strict] - Set true to strictly follow the EDI spec; defaults to false.
           * @param {string|X12SerializationOptions} [encoding] - The encoding to use for this instance when parsing a stream; defaults to UTF-8.
           * @param {X12SerializationOptions} [options] - The options to use when parsing a stream.
           */
          constructor(strict, encoding, options) {
            let allowOptionOverwrite = options === undefined;
            if (strict === undefined) {
              strict = false;
            } else if (typeof strict !== "boolean") {
              allowOptionOverwrite = false;
              options = strict;
              strict = false;
            }
            if (encoding === undefined) {
              encoding = "utf8";
            } else if (typeof encoding !== "string") {
              allowOptionOverwrite = false;
              options = encoding;
              encoding = "utf8";
            }
            super({
              readableObjectMode: true,
              writableObjectMode: true,
              objectMode: true,
              defaultEncoding: encoding,
            });
            this.diagnostics = new Array();
            this._strict = strict;
            this._options = X12SerializationOptions_1.defaultSerializationOptions(
              options,
              allowOptionOverwrite
            );
            this._decoder = new string_decoder_1.StringDecoder(encoding);
            this._parsedISA = false;
            this._flushing = false;
            this._dataCache = "";
            this._segmentCounter = 0;
          }
          /**
           * @description Parse an EDI document.
           * @param {string} edi - An ASCII or UTF8 string of EDI to parse.
           * @param {X12SerializationOptions} [options] - Options for serializing from EDI.
           * @returns {X12Interchange|X12FatInterchange} An interchange or fat interchange.
           */
          parse(edi, options) {
            if (edi === undefined) {
              throw new Errors_1.ArgumentNullError("edi");
            }
            this.diagnostics.splice(0);
            this._validateEdiLength(edi);
            this._detectOptions(edi, options);
            this._validateIsaLength(edi, this._options.elementDelimiter);
            const segments = this._parseSegments(
              edi,
              this._options.segmentTerminator,
              this._options.elementDelimiter
            );
            if (segments.length > 2) {
              segments.forEach((segment) => {
                this._processSegment(segment);
              });
            } else {
              this._validateEdiSegmentCount();
            }
            return this._fatInterchange === undefined
              ? this._interchange
              : this._fatInterchange;
          }
          /**
           * @description Method for processing an array of segments into the node-x12 object model; typically used with the finished output of a stream.
           * @param {X12Segment[]} segments - An array of X12Segment objects.
           * @param {X12SerializationOptions} [options] - Options for serializing from EDI.
           * @returns {X12Interchange|X12FatInterchange} An interchange or fat interchange.
           */
          getInterchangeFromSegments(segments, options) {
            if (options !== undefined) {
              if (this._options.canOverwrite === false) {
                throw new Error(
                  "Options passed in via constructor can not be overridden by instance methods"
                );
              } else {
                this._options = X12SerializationOptions_1.defaultSerializationOptions(
                  options
                );
              }
            }
            segments.forEach((segment) => {
              this._processSegment(segment);
            });
            return this._fatInterchange === undefined
              ? this._interchange
              : this._fatInterchange;
          }
          _validateEdiSegmentCount() {
            const errorMessage =
              "X12 Standard: An EDI document must contain at least one functional group; verify the document contains valid control characters.";
            if (this._strict) {
              throw new Errors_1.ParserError(errorMessage);
            }
            this.diagnostics.push(
              new X12Diagnostic_1.X12Diagnostic(
                X12Diagnostic_1.X12DiagnosticLevel.Error,
                errorMessage,
                new Positioning_1.Range(0, 0, 0, 1)
              )
            );
          }
          _validateEdiLength(edi) {
            if (edi.length < DOCUMENT_MIN_LENGTH) {
              const errorMessage = `X12 Standard: Document is too short. Document must be at least ${DOCUMENT_MIN_LENGTH} characters long to be well-formed X12.`;
              if (this._strict) {
                throw new Errors_1.ParserError(errorMessage);
              }
              this.diagnostics.push(
                new X12Diagnostic_1.X12Diagnostic(
                  X12Diagnostic_1.X12DiagnosticLevel.Error,
                  errorMessage,
                  new Positioning_1.Range(0, 0, 0, edi.length - 1)
                )
              );
            }
          }
          _validateIsaLength(edi, elementDelimiter) {
            if (edi.charAt(103) !== elementDelimiter) {
              const errorMessage =
                "X12 Standard: The ISA segment is not the correct length (106 characters, including segment terminator).";
              if (this._strict) {
                throw new Errors_1.ParserError(errorMessage);
              }
              this.diagnostics.push(
                new X12Diagnostic_1.X12Diagnostic(
                  X12Diagnostic_1.X12DiagnosticLevel.Error,
                  errorMessage,
                  new Positioning_1.Range(0, 0, 0, 2)
                )
              );
            }
          }
          _detectOptions(edi, options) {
            if (options === undefined) {
              if (this._options.canOverwrite === false) {
              } else {
                const segmentTerminator = edi.charAt(SEGMENT_TERMINATOR_POS);
                const elementDelimiter = edi.charAt(ELEMENT_DELIMITER_POS);
                const subElementDelimiter = edi.charAt(
                  SUBELEMENT_DELIMITER_POS
                );
                const repetitionDelimiter = edi.charAt(
                  REPETITION_DELIMITER_POS
                );
                let endOfLine = edi.charAt(END_OF_LINE_POS);
                let format = false;
                if (endOfLine !== "\r" && endOfLine !== "\n") {
                  endOfLine = undefined;
                } else {
                  format = true;
                }
                if (
                  endOfLine === "\r" &&
                  edi.charAt(END_OF_LINE_POS + 1) === "\n"
                ) {
                  endOfLine = "\r\n";
                }
                this._options = X12SerializationOptions_1.defaultSerializationOptions(
                  {
                    segmentTerminator,
                    elementDelimiter,
                    subElementDelimiter,
                    repetitionDelimiter,
                    endOfLine,
                    format,
                  }
                );
              }
            } else {
              this._options = X12SerializationOptions_1.defaultSerializationOptions(
                options
              );
            }
          }
          findLastIndex(list = [], predicate) {
            if (list.length === 0) return -1;
            if (predicate === undefined) return list.length - 1;
            for (let i = list.length - 1; i >= 0; --i) {
              if (predicate(list[i]) === true) return i;
            }
            return -1;
          }
          _parseSegments(edi, segmentTerminator, elementDelimiter) {
            const segments = new Array();
            let tagged = false;
            let currentSegment;
            let currentElement;
            let loopPath = [];
            let loopPathTrailers = [];
            let currentLoopPath = { index: 1 };
            currentSegment = new X12Segment_1.X12Segment();
            currentSegment.options = this._options;
            for (let i = 0, l = 0, c = 0; i < edi.length; i++) {
              // segment not yet named and not whitespace or delimiter - begin naming segment
              if (
                !tagged &&
                edi[i].search(/\s/) === -1 &&
                edi[i] !== elementDelimiter &&
                edi[i] !== segmentTerminator
              ) {
                currentSegment.tag += edi[i];
                if (currentSegment.range.start === undefined) {
                  currentSegment.range.start = new Positioning_1.Position(l, c);
                }
                // trailing line breaks - consume them and increment line number
              } else if (!tagged && edi[i].search(/\s/) > -1) {
                if (edi[i] === "\n") {
                  l++;
                  c = -1;
                }
                // segment tag/name is completed - mark as tagged
              } else if (!tagged && edi[i] === elementDelimiter) {
                tagged = true;
                currentElement = new X12Element_1.X12Element();
                currentElement.range.start = new Positioning_1.Position(l, c);
                // segment terminator
              } else if (edi[i] === segmentTerminator) {
                currentElement.range.end = new Positioning_1.Position(l, c - 1);
                currentSegment.elements.push(currentElement);
                if (
                  currentSegment.tag === "IEA" &&
                  currentSegment.elements.length === 2
                ) {
                  currentSegment.elements[1].value = `${parseInt(
                    currentSegment.elements[1].value,
                    10
                  )}`;
                }
                currentSegment.range.end = new Positioning_1.Position(l, c);
                const header = currentSegment.getHeader();
                // is it time to manage the loop?
                const loopPathUnboundTagIndex = this.findLastIndex(
                  loopPath,
                  (t) => {
                    return (
                      currentSegment.tag === t.tag &&
                      t.type ===
                        X12SegmentHeader_1.X12SegmentHeaderLoopStyle.Unbounded
                    );
                  }
                );
                if (currentSegment.tag === currentLoopPath.tag) {
                  // we are ending an unbounded loop and entering a new of the same type
                  loopPath.pop();
                  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                  const nextIndex = currentLoopPath.index + 1;
                  currentLoopPath = {
                    tag: header.tag,
                    pathTag:
                      header.loopIdIndex === undefined
                        ? header.tag
                        : `${header.tag}=${currentSegment.valueOf(
                            header.loopIdIndex
                          )}[${nextIndex}]`,
                    index: nextIndex,
                    trailer: header.trailer,
                    type: header.loopStyle,
                    allowUnboundChildren: !(
                      header.loopNoUnboundedChildren === true
                    ),
                  };
                  loopPath.push(currentLoopPath);
                } else if (loopPathUnboundTagIndex > -1) {
                  // we are ending an unbound loop at a higher index unless the current loop stops us
                  if (currentLoopPath.allowUnboundChildren === true) {
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    loopPath = loopPath.slice(0, loopPathUnboundTagIndex + 1);
                    const unboundPrevious = loopPath.pop();
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    const nextIndex = unboundPrevious.index + 1;
                    currentLoopPath = {
                      tag: header.tag,
                      pathTag:
                        header.loopIdIndex === undefined
                          ? header.tag
                          : `${header.tag}=${currentSegment.valueOf(
                              header.loopIdIndex
                            )}[${nextIndex}]`,
                      index: nextIndex,
                      trailer: header.trailer,
                      type: header.loopStyle,
                      allowUnboundChildren: !(
                        header.loopNoUnboundedChildren === true
                      ),
                    };
                    loopPath.push(currentLoopPath);
                  }
                } else if (
                  loopPathTrailers.findIndex((t) => currentSegment.tag === t) >
                  -1
                ) {
                  // we are ending a bound loop
                  loopPath.pop();
                  if (loopPath.length > 0) {
                    currentLoopPath = loopPath[loopPath.length - 1];
                  } else {
                    currentLoopPath = { index: 1 };
                  }
                } else if (
                  header !== undefined &&
                  header.loopStyle !== undefined
                ) {
                  // we are staring a new loop
                  currentLoopPath = {
                    tag: header.tag,
                    pathTag:
                      header.loopIdIndex === undefined
                        ? header.tag
                        : `${header.tag}=${currentSegment.valueOf(
                            header.loopIdIndex
                          )}[1]`,
                    index: 1,
                    trailer: header.trailer,
                    type: header.loopStyle,
                    allowUnboundChildren: !(
                      header.loopNoUnboundedChildren === true
                    ),
                  };
                  loopPath.push(currentLoopPath);
                  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                  loopPathTrailers = loopPath.map((lp) => {
                    return lp.trailer || "";
                  });
                }
                currentSegment.loopPath = loopPath
                  .map((lp) => lp.pathTag)
                  .join(".");
                // console.log(currentSegment.loopPath)
                currentSegment.loopIndex = currentLoopPath.index;
                segments.push(currentSegment);
                currentSegment.parseIndex = segments.length;
                currentSegment = new X12Segment_1.X12Segment();
                currentSegment.options = this._options;
                tagged = false;
                if (segmentTerminator === "\n") {
                  l++;
                  c = -1;
                }
                // element delimiter
              } else if (tagged && edi[i] === elementDelimiter) {
                currentElement.range.end = new Positioning_1.Position(l, c - 1);
                currentSegment.elements.push(currentElement);
                if (
                  currentSegment.tag === "ISA" &&
                  currentSegment.elements.length === 13
                ) {
                  currentSegment.elements[12].value = `${parseInt(
                    currentSegment.elements[12].value,
                    10
                  )}`;
                }
                currentElement = new X12Element_1.X12Element();
                currentElement.range.start = new Positioning_1.Position(
                  l,
                  c + 1
                );
                // element data
              } else {
                currentElement.value += edi[i];
              }
              c++;
            }
            return segments;
          }
          _processSegment(seg) {
            if (seg.tag === "ISA") {
              if (
                this._strict &&
                this._interchange !== undefined &&
                this._interchange.header !== undefined
              ) {
                if (this._fatInterchange === undefined) {
                  this._fatInterchange = new X12FatInterchange_1.X12FatInterchange(
                    this._options
                  );
                  this._fatInterchange.interchanges.push(this._interchange);
                }
                this._interchange = new X12Interchange_1.X12Interchange(
                  this._options
                );
              }
              if (this._interchange === undefined) {
                this._interchange = new X12Interchange_1.X12Interchange(
                  this._options
                );
              }
              this._processISA(this._interchange, seg);
              this._parsedISA = true;
            } else if (seg.tag === "IEA") {
              this._processIEA(this._interchange, seg);
              if (this._fatInterchange !== undefined) {
                this._fatInterchange.interchanges.push(this._interchange);
              }
            } else if (seg.tag === "GS") {
              this._group = new X12FunctionalGroup_1.X12FunctionalGroup(
                this._options
              );
              this._processGS(this._group, seg);
              this._interchange.functionalGroups.push(this._group);
            } else if (seg.tag === "GE") {
              if (this._group === undefined) {
                const errorMessage = "X12 Standard: Missing GS segment!";
                if (this._strict) {
                  throw new Errors_1.ParserError(errorMessage);
                }
                this.diagnostics.push(
                  new X12Diagnostic_1.X12Diagnostic(
                    X12Diagnostic_1.X12DiagnosticLevel.Error,
                    errorMessage,
                    seg.range
                  )
                );
              }
              this._processGE(this._group, seg);
              this._group = undefined;
            } else if (seg.tag === "ST") {
              if (this._group === undefined) {
                const errorMessage = `X12 Standard: ${seg.tag} segment cannot appear outside of a functional group.`;
                if (this._strict) {
                  throw new Errors_1.ParserError(errorMessage);
                }
                this.diagnostics.push(
                  new X12Diagnostic_1.X12Diagnostic(
                    X12Diagnostic_1.X12DiagnosticLevel.Error,
                    errorMessage,
                    seg.range
                  )
                );
              }
              this._transaction = new X12Transaction_1.X12Transaction(
                this._options
              );
              this._processST(this._transaction, seg);
              this._group.transactions.push(this._transaction);
            } else if (seg.tag === "SE") {
              if (this._group === undefined) {
                const errorMessage = `X12 Standard: ${seg.tag} segment cannot appear outside of a functional group.`;
                if (this._strict) {
                  throw new Errors_1.ParserError(errorMessage);
                }
                this.diagnostics.push(
                  new X12Diagnostic_1.X12Diagnostic(
                    X12Diagnostic_1.X12DiagnosticLevel.Error,
                    errorMessage,
                    seg.range
                  )
                );
              }
              if (this._transaction === undefined) {
                const errorMessage = "X12 Standard: Missing ST segment!";
                if (this._strict) {
                  throw new Errors_1.ParserError(errorMessage);
                }
                this.diagnostics.push(
                  new X12Diagnostic_1.X12Diagnostic(
                    X12Diagnostic_1.X12DiagnosticLevel.Error,
                    errorMessage,
                    seg.range
                  )
                );
              }
              this._processSE(this._transaction, seg);
              this._transaction = undefined;
            } else {
              if (this._group === undefined) {
                const errorMessage = `X12 Standard: ${seg.tag} segment cannot appear outside of a functional group.`;
                if (this._strict) {
                  throw new Errors_1.ParserError(errorMessage);
                }
                this.diagnostics.push(
                  new X12Diagnostic_1.X12Diagnostic(
                    X12Diagnostic_1.X12DiagnosticLevel.Error,
                    errorMessage,
                    seg.range
                  )
                );
              }
              if (this._transaction === undefined) {
                const errorMessage = `X12 Standard: ${seg.tag} segment cannot appear outside of a transaction.`;
                if (this._strict) {
                  throw new Errors_1.ParserError(errorMessage);
                }
                this.diagnostics.push(
                  new X12Diagnostic_1.X12Diagnostic(
                    X12Diagnostic_1.X12DiagnosticLevel.Error,
                    errorMessage,
                    seg.range
                  )
                );
              } else {
                this._transaction.segments.push(seg);
              }
            }
          }
          _processISA(interchange, segment) {
            interchange.header = segment;
          }
          _processIEA(interchange, segment) {
            interchange.trailer = segment;
            if (
              parseInt(segment.valueOf(1)) !==
              interchange.functionalGroups.length
            ) {
              const errorMessage = `X12 Standard: The value in IEA01 (${segment.valueOf(
                1
              )}) does not match the number of GS segments in the interchange (${
                interchange.functionalGroups.length
              }).`;
              if (this._strict) {
                throw new Errors_1.ParserError(errorMessage);
              }
              this.diagnostics.push(
                new X12Diagnostic_1.X12Diagnostic(
                  X12Diagnostic_1.X12DiagnosticLevel.Error,
                  errorMessage,
                  segment.elements[0].range
                )
              );
            }
            if (segment.valueOf(2) !== interchange.header.valueOf(13)) {
              const errorMessage = `X12 Standard: The value in IEA02 (${segment.valueOf(
                2
              )}) does not match the value in ISA13 (${interchange.header.valueOf(
                13
              )}).`;
              if (this._strict) {
                throw new Errors_1.ParserError(errorMessage);
              }
              this.diagnostics.push(
                new X12Diagnostic_1.X12Diagnostic(
                  X12Diagnostic_1.X12DiagnosticLevel.Error,
                  errorMessage,
                  segment.elements[1].range
                )
              );
            }
          }
          _processGS(group, segment) {
            group.header = segment;
          }
          _processGE(group, segment) {
            group.trailer = segment;
            if (parseInt(segment.valueOf(1)) !== group.transactions.length) {
              const errorMessage = `X12 Standard: The value in GE01 (${segment.valueOf(
                1
              )}) does not match the number of ST segments in the functional group (${
                group.transactions.length
              }).`;
              if (this._strict) {
                throw new Errors_1.ParserError(errorMessage);
              }
              this.diagnostics.push(
                new X12Diagnostic_1.X12Diagnostic(
                  X12Diagnostic_1.X12DiagnosticLevel.Error,
                  errorMessage,
                  segment.elements[0].range
                )
              );
            }
            if (segment.valueOf(2) !== group.header.valueOf(6)) {
              const errorMessage = `X12 Standard: The value in GE02 (${segment.valueOf(
                2
              )}) does not match the value in GS06 (${group.header.valueOf(
                6
              )}).`;
              if (this._strict) {
                throw new Errors_1.ParserError(errorMessage);
              }
              this.diagnostics.push(
                new X12Diagnostic_1.X12Diagnostic(
                  X12Diagnostic_1.X12DiagnosticLevel.Error,
                  errorMessage,
                  segment.elements[1].range
                )
              );
            }
          }
          _processST(transaction, segment) {
            transaction.header = segment;
          }
          _processSE(transaction, segment) {
            transaction.trailer = segment;
            const expectedNumberOfSegments = transaction.segments.length + 2;
            if (parseInt(segment.valueOf(1)) !== expectedNumberOfSegments) {
              const errorMessage = `X12 Standard: The value in SE01 (${segment.valueOf(
                1
              )}) does not match the number of segments in the transaction (${expectedNumberOfSegments}).`;
              if (this._strict) {
                throw new Errors_1.ParserError(errorMessage);
              }
              this.diagnostics.push(
                new X12Diagnostic_1.X12Diagnostic(
                  X12Diagnostic_1.X12DiagnosticLevel.Error,
                  errorMessage,
                  segment.elements[0].range
                )
              );
            }
            if (segment.valueOf(2) !== transaction.header.valueOf(2)) {
              const errorMessage = `X12 Standard: The value in SE02 (${segment.valueOf(
                2
              )}) does not match the value in ST02 (${transaction.header.valueOf(
                2
              )}).`;
              if (this._strict) {
                throw new Errors_1.ParserError(errorMessage);
              }
              this.diagnostics.push(
                new X12Diagnostic_1.X12Diagnostic(
                  X12Diagnostic_1.X12DiagnosticLevel.Error,
                  errorMessage,
                  segment.elements[1].range
                )
              );
            }
          }
          _consumeChunk(chunk) {
            chunk = this._dataCache + chunk;
            let rawSegments;
            if (!this._parsedISA && chunk.length >= DOCUMENT_MIN_LENGTH) {
              this._detectOptions(chunk);
              this._validateIsaLength(chunk, this._options.elementDelimiter);
              rawSegments = chunk.split(this._options.segmentTerminator);
              if (
                chunk.charAt(chunk.length - 1) !==
                this._options.segmentTerminator
              ) {
                this._dataCache = rawSegments[rawSegments.length - 1];
                rawSegments.splice(rawSegments.length - 1, 1);
              }
            }
            if (this._parsedISA) {
              rawSegments = chunk.split(this._options.segmentTerminator);
              if (
                chunk.charAt(chunk.length - 1) !==
                  this._options.segmentTerminator &&
                !this._flushing
              ) {
                this._dataCache = rawSegments[rawSegments.length - 1];
                rawSegments.splice(rawSegments.length - 1, 1);
              }
            }
            if (Array.isArray(rawSegments)) {
              for (let i = 0; i < rawSegments.length; i += 1) {
                if (rawSegments[i].length > 0) {
                  const segments = this._parseSegments(
                    rawSegments[i] + this._options.segmentTerminator,
                    this._options.segmentTerminator,
                    this._options.elementDelimiter
                  );
                  segments.forEach((segment) => {
                    this.push(segment);
                    this._segmentCounter += 1;
                  });
                }
              }
            }
          }
          /**
           * @description Flush method for Node API Transform stream.
           * @param {Function} callback - Callback to execute when finished.
           */
          _flush(callback) {
            this._flushing = true;
            this._consumeChunk(this._dataCache);
            this._flushing = false;
            callback();
            this._validateEdiSegmentCount();
          }
          /**
           * @description Transform method for Node API Transform stream.
           * @param {object} chunk - A chunk of data from the read stream.
           * @param {string} encoding - Chunk enoding.
           * @param {Function} callback - Callback signalling chunk is processed and instance is ready for next chunk.
           */
          _transform(chunk, encoding, callback) {
            this._consumeChunk(this._decoder.write(chunk));
            callback();
          }
        }
        exports.X12Parser = X12Parser;

        /***/
      },
      /* 11 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        const Errors_1 = __webpack_require__(4);
        const X12Interchange_1 = __webpack_require__(6);
        const X12QueryEngine_1 = __webpack_require__(12);
        const X12Transaction_1 = __webpack_require__(5);
        class X12TransactionMap {
          /**
           * @description Factory for mapping transaction set data to javascript object map.
           * @param {object} map - The javascript object containing keys and querys to resolve.
           * @param {X12Transaction} [transaction] - A transaction set to map.
           * @param {Function} helper - A helper function which will be executed on every resolved query value.
           */
          constructor(map, transaction, helper) {
            this._map = map;
            this._transaction = transaction;
            this.helper = helper === undefined ? this._helper : helper;
          }
          /**
           * @description Set the transaction set to map and optionally a helper function.
           * @param {X12Transaction} transaction - A transaction set to map.
           * @param {Function} helper - A helper function which will be executed on every resolved query value.
           */
          setTransaction(transaction, helper) {
            this._transaction = transaction;
            this.helper = helper === undefined ? this._helper : helper;
          }
          /**
           * @description Set the transaction set to map and optionally a helper function.
           * @returns {X12Transaction} The transaction from this instance.
           */
          getTransaction() {
            return this._transaction;
          }
          /**
           * @description Map data from the transaction set to a javascript object.
           * @param {object} map - The javascript object containing keys and querys to resolve.
           * @param {Function} [callback] - A callback function which will be passed to the helper function.
           * @returns {object|object[]} The transaction set mapped to an object or an array of objects.
           */
          toObject(map, callback) {
            map = map === undefined ? this._map : map;
            const clone = JSON.parse(JSON.stringify(map));
            let clones = null;
            const engine = new X12QueryEngine_1.X12QueryEngine(false);
            const interchange = new X12Interchange_1.X12Interchange();
            interchange.setHeader([
              "00",
              "",
              "00",
              "",
              "ZZ",
              "00000000",
              "01",
              "00000000",
              "000000",
              "0000",
              "|",
              "00000",
              "00000000",
              "0",
              "P",
              ">",
            ]);
            interchange.addFunctionalGroup().transactions = [this._transaction];
            Object.keys(map).forEach((key) => {
              if (Object.prototype.hasOwnProperty.call(map, key)) {
                if (
                  Array.isArray(map[key]) &&
                  typeof map[key][0] === "string"
                ) {
                  const newArray = new Array();
                  map[key].forEach((query) => {
                    try {
                      const result = engine.querySingle(interchange, query, "");
                      if (result === null) {
                        newArray.push(null);
                      } else if (
                        result.value === null ||
                        Array.isArray(clone[key][0])
                      ) {
                        if (result.value !== null) {
                          clone[key].forEach((array) => {
                            array.push(
                              this.helper(key, result.value, query, callback)
                            );
                          });
                        } else {
                          let superArray = new Array();
                          if (Array.isArray(clone[key][0])) {
                            superArray = clone[key];
                          }
                          result.values.forEach((value, index) => {
                            if (!Array.isArray(superArray[index])) {
                              superArray[index] = new Array();
                            }
                            superArray[index].push(
                              this.helper(key, value, query, callback)
                            );
                          });
                          newArray.push(...superArray);
                        }
                      } else {
                        newArray.push(
                          this.helper(key, result.value, query, callback)
                        );
                      }
                    } catch (err) {
                      throw new Errors_1.QuerySyntaxError(
                        `${err.message}; bad query in ${map[key]}`
                      );
                    }
                  });
                  clone[key] = newArray;
                } else if (typeof map[key] === "string") {
                  try {
                    const result = engine.querySingle(
                      interchange,
                      map[key],
                      ""
                    );
                    if (result === null) {
                      clone[key] = null;
                    } else if (result.value === null || Array.isArray(clones)) {
                      if (result.value !== null) {
                        clones.forEach((cloned) => {
                          cloned[key] = this.helper(
                            key,
                            result.value,
                            map[key],
                            callback
                          );
                        });
                      } else {
                        if (!Array.isArray(clones)) {
                          clones = new Array();
                        }
                        result.values.forEach((value, index) => {
                          if (clones[index] === undefined) {
                            clones[index] = JSON.parse(JSON.stringify(clone));
                          }
                          clones[index][key] = this.helper(
                            key,
                            value,
                            map[key],
                            callback
                          );
                        });
                      }
                    } else {
                      clone[key] = this.helper(
                        key,
                        result.value,
                        map[key],
                        callback
                      );
                    }
                  } catch (err) {
                    throw new Errors_1.QuerySyntaxError(
                      `${err.message}; bad query in ${map[key]}`
                    );
                  }
                } else {
                  clone[key] = this.toObject(map[key]);
                }
              }
            });
            return Array.isArray(clones) ? clones : clone;
          }
          /**
           * @description Map data from a javascript object to the transaction set.
           * @param {object} input - The input object to create the transaction from.
           * @param {object} [map] - The map to associate values from the input to the transaction, or a macro object.
           * @param {object} [macroObj={}] - A macro object to add or override methods for the macro directive; properties 'header' and 'segments' are reserved words.
           * @returns {X12Transaction} The transaction created from the object values.
           */
          fromObject(input, map, macroObj = {}) {
            const macro = {
              counter: {},
              currentDate: `${new Date().getFullYear()}${(
                new Date().getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}${new Date()
                .getDate()
                .toString()
                .padStart(2, "0")}`,
              sequence: function sequence(value) {
                if (macro.counter[value] === undefined) {
                  macro.counter[value] = 1;
                } else {
                  macro.counter[value] += 1;
                }
                return {
                  val: macro.counter[value],
                };
              },
              json: function json(value) {
                return {
                  val: JSON.parse(value),
                };
              },
              length: function length(value) {
                return {
                  val: value.length,
                };
              },
              map: function map(value, property) {
                return {
                  val: value.map((item) => item[property]),
                };
              },
              sum: function sum(value, property, dec) {
                let sum = 0;
                value.forEach((item) => {
                  sum += item[property];
                });
                return {
                  val: sum.toFixed(dec === undefined ? 0 : dec),
                };
              },
              random: function random() {
                return {
                  val: Math.floor(1000 + Math.random() * 10000),
                };
              },
              truncate: function truncate(value, maxChars) {
                if (Array.isArray(value)) {
                  value = value.map((str) => str.substring(0, maxChars));
                } else {
                  value = `${value}`.substring(0, maxChars);
                }
                return {
                  val: value,
                };
              },
            };
            const resolveKey = function resolveKey(key) {
              const clean = /(^(`\${)*(input|macro)\[.*(}`)*$)/g;
              if (clean.test(key)) {
                // eslint-disable-next-line no-eval
                const result = eval(key);
                return result === undefined ? "" : result;
              } else {
                return key;
              }
            };
            const resolveLoop = function resolveLoop(loop, transaction) {
              const start = loop[0];
              const length = resolveKey(start.loopLength);
              for (let i = 0; i < length; i += 1) {
                loop.forEach((segment) => {
                  const elements = [];
                  for (let j = 0; j < segment.elements.length; j += 1) {
                    const resolved = resolveKey(segment.elements[j]);
                    if (Array.isArray(resolved)) {
                      elements.push(resolved[i]);
                    } else {
                      elements.push(resolved);
                    }
                  }
                  transaction.addSegment(segment.tag, elements);
                });
              }
            };
            if (map !== undefined) {
              if (map.header === undefined || map.segments === undefined) {
                Object.assign(macro, map);
                map = undefined;
              }
            }
            map = map === undefined ? this._map : map;
            Object.assign(macro, macroObj);
            const transaction =
              this._transaction === undefined
                ? new X12Transaction_1.X12Transaction()
                : this._transaction;
            const header = [];
            let looper = [];
            let loop = false;
            for (let i = 0; i < map.header.length; i += 1) {
              header.push(resolveKey(map.header[i]));
            }
            transaction.setHeader(header);
            for (let i = 0; i < map.segments.length; i += 1) {
              const segment = map.segments[i];
              const elements = [];
              if (segment.loopStart) {
                looper.push(segment);
                loop = true;
              } else if (loop) {
                looper.push(segment);
              }
              if (!loop) {
                for (let j = 0; j < segment.elements.length; j += 1) {
                  elements.push(resolveKey(segment.elements[j]));
                }
                transaction.addSegment(segment.tag, elements);
              }
              if (segment.loopEnd) {
                resolveLoop(looper, transaction);
                looper = [];
                loop = false;
              }
            }
            this._transaction = transaction;
            return transaction;
          }
          /**
           * @private
           * @description Default helper function describing the parameters for other helpers.
           * @param {string} key - The current key being set by the mapper.
           * @param {string} value - The current value as resolved by the query engine.
           * @param {string} [query] - The current query as used by the query engine.
           * @param {Function} [callback] - A callback function for signalling back from the helper function.
           * @returns {string} The value as resolved by the query engine; custom helpers may modify this value further.
           */
          _helper(key, value, query, callback) {
            if (callback !== undefined) {
              callback(key, value, query);
            }
            return value;
          }
        }
        exports.X12TransactionMap = X12TransactionMap;

        /***/
      },
      /* 12 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        const Errors_1 = __webpack_require__(4);
        const X12Parser_1 = __webpack_require__(10);
        class X12QueryEngine {
          /**
           * @description Factory for querying EDI using the node-x12 object model.
           * @param {X12Parser|boolean} [parser] - Pass an external parser or set the strictness of the internal parser.
           */
          constructor(parser = true) {
            this._forEachPattern = /FOREACH\([A-Z0-9]{2,3}\)=>.+/g;
            this._concatPattern = /CONCAT\(.+,.+\)=>.+/g;
            this._forSegLoopPattern = /FORSEGLOOP\((.+)\)=>(.+)/g;
            this._parser =
              typeof parser === "boolean"
                ? new X12Parser_1.X12Parser(parser)
                : parser;
          }
          /**
           * @description Query all references in an EDI document.
           * @param {string|X12Interchange} rawEdi - An ASCII or UTF8 string of EDI to parse, or an interchange.
           * @param {string} reference - The query string to resolve.
           * @param {string} [defaultValue=null] - A default value to return if result not found.
           * @returns {X12QueryResult[]} An array of results from the EDI document.
           */
          query(rawEdi, reference, defaultValue = null) {
            const interchange =
              typeof rawEdi === "string" ? this._parser.parse(rawEdi) : rawEdi;
            let segLoopFilter;
            let segLoopFilterIsRegex = false;
            const forEachMatch = reference.match(this._forEachPattern); // ex. FOREACH(LX)=>MAN02
            if (forEachMatch !== null) {
              reference = this._evaluateForEachQueryPart(forEachMatch[0]);
            }
            const concathMatch = reference.match(this._concatPattern); // ex. CONCAT(MAN01,-)=>MAN02
            let concat;
            if (concathMatch !== null) {
              concat = this._evaluateConcatQueryPart(
                interchange,
                concathMatch[0]
              );
              reference = concat.query;
            }
            // eslint-disable-next-line dot-notation
            const forSegLoopMatch = [
              ...reference["matchAll"](this._forSegLoopPattern),
            ]; // ex. FORSEGLOOP(ISA.GS.ST=271.HL=22.NM1=IL.EB=1)=>DTP
            if (forSegLoopMatch.length === 1) {
              segLoopFilter = forSegLoopMatch[0][1];
              segLoopFilterIsRegex =
                segLoopFilter !== undefined ? segLoopFilter[0] === "^" : false;
              reference = forSegLoopMatch[0][2];
            } else if (forSegLoopMatch.length > 1) {
              throw new Error(
                "Error parsing FORSEGLOOP marco, found too many results."
              );
            }
            const hlPathMatch = reference.match(/HL\+(\w\+?)+[+-]/g); // ex. HL+O+P+I
            const segPathMatch = reference.match(/((?<!\+)[A-Z0-9]{2,3}-)+/g); // ex. PO1-N9-
            const elmRefMatch = reference.match(/[A-Z0-9]{2,3}[0-9]{2}[^[]?/g); // ex. REF02; need to remove trailing ":" if exists
            const qualMatch = reference.match(
              /:[A-Z0-9]{2,3}[0-9]{2,}\[["'][^[\]"']+["']\]/g
            ); // ex. :REF01["PO"]
            let results = new Array();
            for (let i = 0; i < interchange.functionalGroups.length; i++) {
              const group = interchange.functionalGroups[i];
              for (let j = 0; j < group.transactions.length; j++) {
                const txn = group.transactions[j];
                let segments;
                if (segLoopFilter !== undefined) {
                  if (segLoopFilterIsRegex === true) {
                    segments = txn.segments.filter((s) => {
                      return s.loopIndex !== undefined
                        ? s.loopPath.match(segLoopFilter) !== null
                        : false;
                    });
                  } else {
                    segments = txn.segments.filter((s) => {
                      return s.loopPath === segLoopFilter;
                    });
                  }
                } else {
                  segments = txn.segments;
                }
                if (hlPathMatch !== null) {
                  segments = this._evaluateHLQueryPart(
                    segments,
                    hlPathMatch[0]
                  );
                }
                if (segPathMatch !== null) {
                  segments = this._evaluateSegmentPathQueryPart(
                    segments,
                    segPathMatch[0]
                  );
                }
                if (elmRefMatch === null) {
                  if (reference !== "*") {
                    throw new Errors_1.QuerySyntaxError(
                      "Element reference queries must contain an element reference!"
                    );
                  }
                }
                if (reference === "*") {
                  results = this._evaluateStarReferenceQueryPart(
                    interchange,
                    group,
                    txn,
                    segments
                  );
                } else {
                  const txnResults = this._evaluateElementReferenceQueryPart(
                    interchange,
                    group,
                    txn,
                    [].concat(segments, [
                      interchange.header,
                      group.header,
                      txn.header,
                      txn.trailer,
                      group.trailer,
                      interchange.trailer,
                    ]),
                    elmRefMatch[0],
                    qualMatch,
                    defaultValue
                  );
                  txnResults.forEach((res) => {
                    if (concat !== undefined) {
                      res.value = `${concat.value}${concat.separator}${res.value}`;
                    }
                    results.push(res);
                  });
                }
              }
            }
            return results;
          }
          /**
           * @description Query all references in an EDI document and return the first result.
           * @param {string|X12Interchange} rawEdi - An ASCII or UTF8 string of EDI to parse, or an interchange.
           * @param {string} reference - The query string to resolve.
           * @param {string} [defaultValue=null] - A default value to return if result not found.
           * @returns {X12QueryResult} A result from the EDI document.
           */
          querySingle(rawEdi, reference, defaultValue = null) {
            const results = this.query(rawEdi, reference);
            if (reference.match(this._forEachPattern) !== null) {
              const values = results.map((result) => result.value);
              if (values.length !== 0) {
                results[0].value = null;
                results[0].values = values;
              }
            }
            return results.length === 0 ? null : results[0];
          }
          _getMacroParts(macroQuery) {
            const macroPart = macroQuery.substr(0, macroQuery.indexOf("=>"));
            const queryPart = macroQuery.substr(macroQuery.indexOf("=>") + 2);
            const parameters = macroPart.substr(
              macroPart.indexOf("(") + 1,
              macroPart.length - macroPart.indexOf("(") - 2
            );
            return {
              macroPart,
              queryPart,
              parameters,
            };
          }
          _evaluateForEachQueryPart(forEachSegment) {
            const { queryPart, parameters } = this._getMacroParts(
              forEachSegment
            );
            return `${parameters}-${queryPart}`;
          }
          _evaluateConcatQueryPart(interchange, concatSegment) {
            const { queryPart, parameters } = this._getMacroParts(
              concatSegment
            );
            let value = "";
            const expandedParams = parameters.split(",");
            if (expandedParams.length === 3) {
              expandedParams[1] = ",";
            }
            const result = this.querySingle(interchange, expandedParams[0]);
            if (result !== null) {
              if (result.value !== null && result.value !== undefined) {
                value = result.value;
              } else if (Array.isArray(result.values)) {
                value = result.values.join(expandedParams[1]);
              }
            }
            return {
              value,
              separator: expandedParams[1],
              query: queryPart,
            };
          }
          _evaluateHLQueryPart(segments, hlPath) {
            let qualified = false;
            const pathParts = hlPath
              .replace("-", "")
              .split("+")
              .filter((value, index, array) => {
                return value !== "HL" && value !== "" && value !== null;
              });
            const matches = new Array();
            let lastParentIndex = -1;
            for (let i = 0, j = 0; i < segments.length; i++) {
              const segment = segments[i];
              if (qualified && segment.tag === "HL") {
                const parentIndex = parseInt(segment.valueOf(2, "-1"));
                if (parentIndex !== lastParentIndex) {
                  j = 0;
                  qualified = false;
                }
              }
              if (
                !qualified &&
                segments[i].tag === "HL" &&
                segments[i].valueOf(3) === pathParts[j]
              ) {
                lastParentIndex = parseInt(segment.valueOf(2, "-1"));
                j++;
                if (j === pathParts.length) {
                  qualified = true;
                }
              }
              if (qualified) {
                matches.push(segments[i]);
              }
            }
            return matches;
          }
          _evaluateSegmentPathQueryPart(segments, segmentPath) {
            let qualified = false;
            const pathParts = segmentPath
              .split("-")
              .filter((value, index, array) => {
                return !!value;
              }); // eslint-disable-line @typescript-eslint/strict-boolean-expressions
            const matches = new Array();
            for (let i = 0, j = 0; i < segments.length; i++) {
              if (
                qualified &&
                (segments[i].tag === "HL" ||
                  pathParts.indexOf(segments[i].tag) > -1)
              ) {
                j = 0;
                qualified = false;
              }
              if (!qualified && segments[i].tag === pathParts[j]) {
                j++;
                if (j === pathParts.length) {
                  qualified = true;
                }
              }
              if (qualified) {
                matches.push(segments[i]);
              }
            }
            return matches;
          }
          _evaluateElementReferenceQueryPart(
            interchange,
            functionalGroup,
            transaction,
            segments,
            elementReference,
            qualifiers,
            defaultValue = null
          ) {
            const results = new Array();
            const reference = elementReference.replace(":", "");
            const tag = reference.substr(0, reference.length - 2);
            const pos = reference.substr(reference.length - 2, 2);
            const posint = parseInt(pos);
            for (let i = 0; i < segments.length; i++) {
              const segment = segments[i];
              if (segment === null || segment === undefined) {
                continue;
              }
              if (segment.tag !== tag) {
                continue;
              }
              const value = segment.valueOf(posint, defaultValue);
              if (
                value !== null &&
                this._testQualifiers(transaction, segment, qualifiers)
              ) {
                results.push(
                  new X12QueryResult(
                    interchange,
                    functionalGroup,
                    transaction,
                    segment,
                    segment.elements[posint - 1],
                    value
                  )
                );
              }
            }
            return results;
          }
          _evaluateStarReferenceQueryPart(
            interchange,
            functionalGroup,
            transaction,
            segments
          ) {
            const results = new Array();
            for (let i = 0; i < segments.length; i++) {
              const segment = segments[i];
              if (segment === null || segment === undefined) {
                continue;
              }
              const value = segment.valueOf(1, "?");
              if (value !== null) {
                results.push(
                  new X12QueryResult(
                    interchange,
                    functionalGroup,
                    transaction,
                    segment,
                    segment.elements[0],
                    value
                  )
                );
              }
            }
            return results;
          }
          _testQualifiers(transaction, segment, qualifiers) {
            if (qualifiers === undefined || qualifiers === null) {
              return true;
            }
            for (let i = 0; i < qualifiers.length; i++) {
              const qualifier = qualifiers[i].substr(1);
              const elementReference = qualifier.substring(
                0,
                qualifier.indexOf("[")
              );
              const elementValue = qualifier.substring(
                qualifier.indexOf("[") + 2,
                qualifier.lastIndexOf("]") - 1
              );
              const tag = elementReference.substr(
                0,
                elementReference.length - 2
              );
              const pos = elementReference.substr(
                elementReference.length - 2,
                2
              );
              const posint = parseInt(pos);
              for (let j = transaction.segments.indexOf(segment); j > -1; j--) {
                const seg = transaction.segments[j];
                const value = seg.valueOf(posint);
                if (
                  seg.tag === tag &&
                  seg.tag === segment.tag &&
                  value !== elementValue
                ) {
                  return false;
                } else if (seg.tag === tag && value === elementValue) {
                  break;
                }
                if (j === 0) {
                  return false;
                }
              }
            }
            return true;
          }
        }
        exports.X12QueryEngine = X12QueryEngine;
        /**
         * @description A result as resolved by the query engine.
         * @typedef {object} X12QueryResult
         * @property {X12Interchange} interchange
         * @property {X12FunctionalGroup} functionalGroup
         * @property {X12Transaction} transaction
         * @property {X12Segment} segment
         * @property {X12Element} element
         * @property {string} [value=null]
         * @property {Array<string | string[]>} [values=[]]
         */
        class X12QueryResult {
          constructor(
            interchange,
            functionalGroup,
            transaction,
            segment,
            element,
            value
          ) {
            this.interchange = interchange;
            this.functionalGroup = functionalGroup;
            this.transaction = transaction;
            this.segment = segment;
            this.element = element;
            this.value =
              value === null || value === undefined ? element.value : value;
            this.values = new Array();
          }
        }
        exports.X12QueryResult = X12QueryResult;

        /***/
      },
      /* 13 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        function __export(m) {
          for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
        }
        Object.defineProperty(exports, "__esModule", { value: true });
        __export(__webpack_require__(2));
        __export(__webpack_require__(7));
        __export(__webpack_require__(9));
        __export(__webpack_require__(19));
        __export(__webpack_require__(6));
        __export(__webpack_require__(10));
        __export(__webpack_require__(12));
        __export(__webpack_require__(3));
        __export(__webpack_require__(0));
        __export(__webpack_require__(5));
        __export(__webpack_require__(11));
        __export(__webpack_require__(1));

        /***/
      },
      /* 14 */
      /***/ function (module, exports) {
        module.exports = require("os");

        /***/
      },
      /* 15 */
      /***/ function (module, exports) {
        module.exports = require("stream");

        /***/
      },
      /* 16 */
      /***/ function (module, exports) {
        module.exports = require("string_decoder");

        /***/
      },
      /* 17 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        var X12DiagnosticLevel;
        (function (X12DiagnosticLevel) {
          X12DiagnosticLevel[(X12DiagnosticLevel["Info"] = 0)] = "Info";
          X12DiagnosticLevel[(X12DiagnosticLevel["Warning"] = 1)] = "Warning";
          X12DiagnosticLevel[(X12DiagnosticLevel["Error"] = 2)] = "Error";
        })(
          (X12DiagnosticLevel =
            exports.X12DiagnosticLevel || (exports.X12DiagnosticLevel = {}))
        );
        class X12Diagnostic {
          constructor(level, message, range) {
            this.level = level === undefined ? X12DiagnosticLevel.Error : level;
            this.message = message === undefined ? "" : message;
            this.range = range;
          }
        }
        exports.X12Diagnostic = X12Diagnostic;

        /***/
      },
      /* 18 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        const X12SerializationOptions_1 = __webpack_require__(0);
        class X12FatInterchange extends Array {
          /**
           * @description Create a fat interchange.
           * @param {X12Interchange[] | X12SerializationOptions} [items] - The items for this array or options for this interchange.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          constructor(items, options) {
            if (Array.isArray(items)) {
              super(...items);
            } else {
              super();
              this.options = X12SerializationOptions_1.defaultSerializationOptions(
                items
              );
            }
            if (options !== undefined) {
              this.options = X12SerializationOptions_1.defaultSerializationOptions(
                options
              );
            }
            this.interchanges = this;
          }
          /**
           * @description Serialize fat interchange to EDI string.
           * @param {X12SerializationOptions} [options] - Options to override serializing back to EDI.
           * @returns {string} This fat interchange converted to EDI string.
           */
          toString(options) {
            options =
              options !== undefined
                ? X12SerializationOptions_1.defaultSerializationOptions(options)
                : this.options;
            let edi = "";
            for (let i = 0; i < this.interchanges.length; i++) {
              edi += this.interchanges[i].toString(options);
              if (options.format) {
                edi += options.endOfLine;
              }
            }
            return edi;
          }
          /**
           * @description Serialize interchange to JS EDI Notation object.
           * @returns {JSEDINotation[]} This fat interchange converted to an array of JS EDI notation.
           */
          toJSEDINotation() {
            const jsen = new Array();
            this.interchanges.forEach((interchange) => {
              jsen.push(interchange.toJSEDINotation());
            });
            return jsen;
          }
          /**
           * @description Serialize interchange to JSON object.
           * @returns {object[]} This fat interchange converted to an array of objects.
           */
          toJSON() {
            return this.toJSEDINotation();
          }
        }
        exports.X12FatInterchange = X12FatInterchange;

        /***/
      },
      /* 19 */
      /***/ function (module, exports, __webpack_require__) {
        "use strict";

        Object.defineProperty(exports, "__esModule", { value: true });
        const JSEDINotation_1 = __webpack_require__(2);
        const X12Interchange_1 = __webpack_require__(6);
        const X12Parser_1 = __webpack_require__(10);
        const X12SerializationOptions_1 = __webpack_require__(0);
        class X12Generator {
          /**
           * @description Factory for generating EDI from JS EDI Notation.
           * @param {JSEDINotation} [jsen] - Javascript EDI Notation object to serialize.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          constructor(jsen, options) {
            this.jsen =
              jsen === undefined ? new JSEDINotation_1.JSEDINotation() : jsen;
            if (jsen.options !== undefined) {
              this.options = X12SerializationOptions_1.defaultSerializationOptions(
                jsen.options,
                false
              );
            } else if (options !== undefined) {
              this.options = X12SerializationOptions_1.defaultSerializationOptions(
                options,
                false
              );
            } else {
              this.options = X12SerializationOptions_1.defaultSerializationOptions();
            }
            this.interchange = new X12Interchange_1.X12Interchange(
              this.options
            );
          }
          /**
           * @description Set the JS EDI Notation for this instance.
           * @param {JSEDINotation} [jsen] - Javascript EDI Notation object to serialize.
           */
          setJSEDINotation(jsen) {
            this.jsen = jsen;
          }
          /**
           * @description Get the JS EDI Notation for this instance.
           * @returns {JSEDINotation} The JS EDI Notation for this instance.
           */
          getJSEDINotation() {
            return this.jsen;
          }
          /**
           * @description Set the serialization options for this instance.
           * @param {X12SerializationOptions} [options] - Options for serializing back to EDI.
           */
          setOptions(options) {
            this.options = X12SerializationOptions_1.defaultSerializationOptions(
              options,
              false
            );
          }
          /**
           * @description Get the serialization options for this instance.
           * @returns {X12SerializationOptions} The serialization options for this instance.
           */
          getOptions() {
            return this.options;
          }
          /**
           * @description Validate the EDI in this instance.
           * @returns {X12Interchange} This instance converted to an interchange.
           */
          validate() {
            this._generate();
            return new X12Parser_1.X12Parser(true).parse(
              this.interchange.toString(this.options)
            );
          }
          /**
           * @description Serialize the EDI in this instance.
           * @returns {string} This instance converted to an EDI string.
           */
          toString() {
            return this.validate().toString(this.options);
          }
          /**
           * @private
           * @description Generate an interchange from the JS EDI Notation in this instance.
           */
          _generate() {
            const genInterchange = new X12Interchange_1.X12Interchange(
              this.options
            );
            genInterchange.setHeader(this.jsen.header);
            this.jsen.functionalGroups.forEach((functionalGroup) => {
              const genFunctionalGroup = genInterchange.addFunctionalGroup();
              genFunctionalGroup.setHeader(functionalGroup.header);
              functionalGroup.transactions.forEach((transaction) => {
                const genTransaction = genFunctionalGroup.addTransaction();
                genTransaction.setHeader(transaction.header);
                transaction.segments.forEach((segment) => {
                  genTransaction.addSegment(segment.tag, segment.elements);
                });
              });
            });
            this.interchange = genInterchange;
          }
        }
        exports.X12Generator = X12Generator;

        /***/
      },
      /******/
    ]
  )
);
