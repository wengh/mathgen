'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parser = new Parser();

Array.prototype.randElement = function () {
    return this[Math.floor(Math.random() * this.length)];
};

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randBool(chance) {
    return Math.random() < chance;
}

var Expression = function () {
    function Expression(source) {
        _classCallCheck(this, Expression);

        if (isNaN(source)) {
            this.expression = parser.parse(source);
            this.isNumber = false;
        } else {
            this.expression = Number(source);
            this.isNumber = true;
        }
    }

    _createClass(Expression, [{
        key: 'value',
        value: function value() {
            var variables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.isNumber ? this.expression : this.expression.evaluate(variables);
        }
    }]);

    return Expression;
}();

var RandRange = function () {
    function RandRange(minA, maxA, minB, maxB) {
        var bFirst = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

        _classCallCheck(this, RandRange);

        this.minA = new Expression(minA);
        this.maxA = new Expression(maxA);
        this.minB = new Expression(minB);
        this.maxB = new Expression(maxB);
        this.bFirst = bFirst;
    }

    _createClass(RandRange, [{
        key: 'generate',
        value: function generate() {
            var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            if (a !== undefined && b !== undefined) {
                return [a, b];
            } else if (a === undefined && b === undefined) {
                if (this.bFirst) {
                    b = randInt(this.minB.value(), this.maxB.value());
                } else {
                    a = randInt(this.minA.value(), this.maxA.value());
                }
            }
            if (a !== undefined) {
                b = randInt(this.minB.value({ a: a }), this.maxB.value({ a: a }));
                return [a, b];
            } else if (b !== undefined) {
                a = randInt(this.minA.value({ b: b }), this.maxA.value({ b: b }));
            }
            return [a, b];
        }
    }]);

    return RandRange;
}();

var RandRangeAdv = function (_RandRange) {
    _inherits(RandRangeAdv, _RandRange);

    function RandRangeAdv(minA, maxA, minB, maxB, expression, target) {
        var BFirst = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

        _classCallCheck(this, RandRangeAdv);

        var _this = _possibleConstructorReturn(this, (RandRangeAdv.__proto__ || Object.getPrototypeOf(RandRangeAdv)).call(this, minA, maxA, minB, maxB, BFirst));

        _this.expression = parser.parse(expression);
        if (target === 'a') _this.target = 0;else if (target === 'b') _this.target = 1;
        return _this;
    }

    _createClass(RandRangeAdv, [{
        key: 'generate',
        value: function generate() {
            var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
            var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var result = _get(RandRangeAdv.prototype.__proto__ || Object.getPrototypeOf(RandRangeAdv.prototype), 'generate', this).call(this, a, b);
            if (!(a !== undefined && this.target === 0 || b !== undefined && this.target === 1)) {
                result[this.target] = this.expression.evaluate({ a: result[0], b: result[1] });
            }
            return result;
        }
    }]);

    return RandRangeAdv;
}(RandRange);

var Rule = function () {
    function Rule(condition) {
        _classCallCheck(this, Rule);

        this.condition = parser.parse(condition);
    }

    _createClass(Rule, [{
        key: 'validate',
        value: function validate() {
            var variables = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.condition.evaluate(variables);
        }
    }]);

    return Rule;
}();

var OperatorGen = function () {
    function OperatorGen(operator, range) {
        _classCallCheck(this, OperatorGen);

        this.operator = operator;
        this.range = range;

        for (var _len = arguments.length, rules = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            rules[_key - 2] = arguments[_key];
        }

        this.rules = rules;
    }

    _createClass(OperatorGen, [{
        key: 'generate',
        value: function generate() {
            var _this2 = this;

            var operatorGenFuncA = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
            var operatorGenFuncB = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var a = 0,
                b = 0;
            var i = 0;
            var variables = void 0;
            var generateFunc = function generateFunc() {
                var _range$generate, _range$generate2;

                return _range$generate = _this2.range.generate(), _range$generate2 = _slicedToArray(_range$generate, 2), a = _range$generate2[0], b = _range$generate2[1], _range$generate;
            };
            if (operatorGenFuncA !== undefined && operatorGenFuncB !== undefined) {
                generateFunc = function generateFunc() {
                    a = operatorGenFuncA();
                    b = operatorGenFuncB();
                };
            } else if (operatorGenFuncA !== undefined) {
                generateFunc = function generateFunc() {
                    a = operatorGenFuncA();

                    var _range$generate3 = _this2.range.generate(a);

                    var _range$generate4 = _slicedToArray(_range$generate3, 2);

                    a = _range$generate4[0];
                    b = _range$generate4[1];
                };
            } else if (operatorGenFuncB !== undefined) {
                generateFunc = function generateFunc() {
                    b = operatorGenFuncB();

                    var _range$generate5 = _this2.range.generate(b);

                    var _range$generate6 = _slicedToArray(_range$generate5, 2);

                    a = _range$generate6[0];
                    b = _range$generate6[1];
                };
            }
            do {
                generateFunc();
                variables = { a: a.evaluate(), b: b.evaluate() };
                i++;
            } while (!this.rules.every(function (x) {
                return x.validate(variables);
            }) && i <= 10000);
            if (i >= 10000) {
                return undefined;
            }
            return new this.operator(a, b);
        }
    }]);

    return OperatorGen;
}();

var Generator = function () {
    function Generator(minOperators, maxOperators) {
        _classCallCheck(this, Generator);

        this.min = minOperators;
        this.max = maxOperators;

        for (var _len2 = arguments.length, operatorGens = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            operatorGens[_key2 - 2] = arguments[_key2];
        }

        this.generators = operatorGens;
    }

    _createClass(Generator, [{
        key: 'generate',
        value: function generate() {
            var _this3 = this;

            var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            var results = [];
            for (var i = 0; i < count; i++) {
                var len = randInt(this.min, this.max);
                if (len === 1) {
                    results.push(this.generators.randElement().generate());
                } else if (len === 2) {
                    (function () {
                        var first = _this3.generators.randElement();
                        var second = _this3.generators.randElement();
                        if (randBool(0.5)) {
                            results.push(first.generate(function () {
                                return second.generate();
                            }));
                        } else {
                            results.push(first.generate(undefined, function () {
                                return second.generate();
                            }));
                        }
                    })();
                }
            }
            return results;
        }
    }]);

    return Generator;
}();

var vm = new Vue({
    // 选项
});
//# sourceMappingURL=mathgen.js.map