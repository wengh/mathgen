'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(Number.prototype, "priority", {
    get: function get() {
        return 1000;
    }
});
Number.prototype.evaluate = function () {
    return this;
};

var Operator = function () {
    function Operator(a, b) {
        _classCallCheck(this, Operator);

        this.a = a;
        this.b = b;
    }

    _createClass(Operator, [{
        key: 'toString',
        value: function toString() {
            return this.a.toString() + ' ' + this.b.toString();
        }
    }, {
        key: 'format',
        value: function format(symbol, parenthesesA, parenthesesB) {
            var result = '';
            if (parenthesesA) {
                result += '(' + this.a.toString() + ')';
            } else {
                result += this.a.toString();
            }
            result += ' ' + symbol + ' ';
            if (parenthesesB) {
                result += '(' + this.b.toString() + ')';
            } else {
                result += this.b.toString();
            }
            return result;
        }
    }, {
        key: 'evaluate',
        value: function evaluate() {
            return 0;
        }
    }, {
        key: 'priority',
        get: function get() {
            return 0;
        }
    }, {
        key: 'floorPriority',
        get: function get() {
            return Math.floor(this.priority / 10) * 10;
        }
    }]);

    return Operator;
}();

var Addition = function (_Operator) {
    _inherits(Addition, _Operator);

    function Addition(a, b) {
        _classCallCheck(this, Addition);

        return _possibleConstructorReturn(this, (Addition.__proto__ || Object.getPrototypeOf(Addition)).call(this, a, b));
    }

    _createClass(Addition, [{
        key: 'toString',
        value: function toString() {
            return this.format('+', false, this.b.priority < this.priority);
        }
    }, {
        key: 'evaluate',
        value: function evaluate() {
            return this.a.evaluate() + this.b.evaluate();
        }
    }, {
        key: 'priority',
        get: function get() {
            return 5;
        }
    }]);

    return Addition;
}(Operator);

var Subtraction = function (_Operator2) {
    _inherits(Subtraction, _Operator2);

    function Subtraction(a, b) {
        _classCallCheck(this, Subtraction);

        return _possibleConstructorReturn(this, (Subtraction.__proto__ || Object.getPrototypeOf(Subtraction)).call(this, a, b));
    }

    _createClass(Subtraction, [{
        key: 'toString',
        value: function toString() {
            return this.format('-', false, this.b.priority <= this.priority);
        }
    }, {
        key: 'evaluate',
        value: function evaluate() {
            return this.a.evaluate() - this.b.evaluate();
        }
    }, {
        key: 'priority',
        get: function get() {
            return 4;
        }
    }]);

    return Subtraction;
}(Operator);

var Multiplication = function (_Operator3) {
    _inherits(Multiplication, _Operator3);

    function Multiplication(a, b) {
        _classCallCheck(this, Multiplication);

        return _possibleConstructorReturn(this, (Multiplication.__proto__ || Object.getPrototypeOf(Multiplication)).call(this, a, b));
    }

    _createClass(Multiplication, [{
        key: 'toString',
        value: function toString() {
            return this.format('*', this.a.priority < this.floorPriority, this.b.priority < this.priority);
        }
    }, {
        key: 'evaluate',
        value: function evaluate() {
            return this.a.evaluate() * this.b.evaluate();
        }
    }, {
        key: 'priority',
        get: function get() {
            return 15;
        }
    }]);

    return Multiplication;
}(Operator);

var Division = function (_Operator4) {
    _inherits(Division, _Operator4);

    function Division(a, b) {
        _classCallCheck(this, Division);

        return _possibleConstructorReturn(this, (Division.__proto__ || Object.getPrototypeOf(Division)).call(this, a, b));
    }

    _createClass(Division, [{
        key: 'toString',
        value: function toString() {
            return this.format('/', this.a.priority < this.floorPriority, this.b.priority <= this.priority);
        }
    }, {
        key: 'evaluate',
        value: function evaluate() {
            return this.a.evaluate() / this.b.evaluate();
        }
    }], [{
        key: 'priority',
        get: function get() {
            return 14;
        }
    }]);

    return Division;
}(Operator);

var Operators = [Addition, Subtraction, Multiplication, Division];

var OperatorsEnum = {
    addition: 1,
    subtraction: 2,
    multiplication: 4,
    division: 8
};
//# sourceMappingURL=operators.js.map