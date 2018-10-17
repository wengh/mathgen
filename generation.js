let parser = new Parser();

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

class Expression {
    constructor(source) {
        this.expr = source;
    }

    set expr(source) {
        if (isNaN(source)) {
            if (source instanceof Expression) {
                this.source = source.source;
                this.expression = source.expression;
                this.isNumber = source.isNumber;
            }
            else {
                this.source = source;
                this.expression = parser.parse(source);
                this.isNumber = false;
            }
        }
        else {
            this.source = source.toString();
            this.expression = Number(source);
            this.isNumber = true;
        }
    }

    get expr() {
        return this.source;
    }

    value(variables = {}) {
        return this.isNumber ? this.expression : this.expression.evaluate(variables);
    }
}

class RandRange {
    constructor(minA, maxA, minB, maxB, bFirst = false) {
        this.minA = minA;
        this.maxA = maxA;
        this.minB = minB;
        this.maxB = maxB;
        this.bFirst = bFirst;
    }

    generate(a = undefined, b = undefined) {
        if (a !== undefined && b !== undefined) {
            return [a, b];
        }
        else if (a === undefined && b === undefined) {
            if (this.bFirst) {
                b = randInt(this._minB.value(), this._maxB.value());
            }
            else {
                a = randInt(this._minA.value(), this._maxA.value());
            }
        }
        if (a !== undefined) {
            b = randInt(this._minB.value({a: a}), this._maxB.value({a: a}));
            return [a, b];
        }
        else if (b !== undefined) {
            a = randInt(this._minA.value({b: b}), this._maxA.value({b: b}));
        }
        return [a, b];
    }

    set first(num) {
        num = parseInt(num);
        if (num === 0) {
            this.bFirst = false;
        }
        else if (num === 1) {
            this.bFirst = true;
        }
    }
    get first() {
        return this.bFirst ? 1 : 0;
    }

    set minA(expr) {
        this._minA = new Expression(expr);
    }
    get minA() {
        return this._minA.source;
    }
    set maxA(expr) {
        this._maxA = new Expression(expr);
    }
    get maxA() {
        return this._maxA.source;
    }
    set minB(expr) {
        this._minB = new Expression(expr);
    }
    get minB() {
        return this._minB.source;
    }
    set maxB(expr) {
        this._maxB = new Expression(expr);
    }
    get maxB() {
        return this._maxB.source;
    }

    get isAdv() {
        return false;
    }
}

class RandRangeAdv extends RandRange {
    constructor(minA, maxA, minB, maxB, expression, target, BFirst = false) {
        super(minA, maxA, minB, maxB, BFirst);
        this.expression = parser.parse(expression);
        if (target === 'a') this.target = 0;
        else if (target === 'b') this.target = 1;
    }

    setExpression(expression) {
        this.expression = parser.parse(expression);
    }

    setTarget(target) {
        if (target === 'a') this.target = 0;
        else if (target === 'b') this.target = 1;
    }

    generate(a = undefined, b = undefined) {
        let result = super.generate(a, b);
        if (!((a !== undefined && this.target === 0) || (b !== undefined && this.target === 1))) {
            result[this.target] = this.expression.evaluate({a: result[0], b: result[1]});
        }
        return result;
    }

    get isAdv() {
        return true;
    }
}

class Rule {
    constructor(condition) {
        if (condition !== undefined) {
            this.condition = condition;
        }
        else {
            this.source = '';
        }
    }

    set condition(expr) {
        this._condition = parser.parse(expr);
        this.source = expr;
    }
    get condition() {
        return this.source;
    }

    validate(variables = {}) {
        return this._condition.evaluate(variables);
    }
}

class OperatorGen {
    constructor(operator, range, ...rules) {
        this.operator = operator;
        this.range = range;
        this.rules = rules;
    }

    toggleRangeType() {
        if (this.range.isAdv) {
            this.range = new RandRange(this.range.minA, this.range.maxA, this.range.minB, this.range.maxB, this.range.bFirst);
        }
        else {
            this.range = new RandRangeAdv(this.range.minA, this.range.maxA, this.range.minB, this.range.maxB, 'a', 'a', this.range.bFirst);
        }
    }

    addRule() {
        this.rules.push(new Rule());
    }

    get operatorName() {
        return Operators[this.operator].locName;
    }

    generate(operatorGenFuncA = undefined, operatorGenFuncB = undefined) {
        let a = 0, b = 0;
        let i = 0;
        let variables;
        let generateFunc = () => [a, b] = this.range.generate();
        if (operatorGenFuncA !== undefined && operatorGenFuncB !== undefined) {
            generateFunc = () => {
                a = operatorGenFuncA();
                b = operatorGenFuncB();
            }
        }
        else if (operatorGenFuncA !== undefined) {
            generateFunc = () => {
                a = operatorGenFuncA();
                [a, b] = this.range.generate(a);
            }
        }
        else if (operatorGenFuncB !== undefined) {
            generateFunc = () => {
                b = operatorGenFuncB();
                [a, b] = this.range.generate(b);
            }
        }
        do {
            generateFunc();
            variables = {a: a.evaluate(), b: b.evaluate()};
            i++;
        }
        while (!this.rules.every(x => x.validate(variables)) && i <= 10000);
        if (i >= 10000) {
            return undefined;
        }
        return new Operators[this.operator](a, b);
    }
}

class Generator {
    constructor(minOperators, maxOperators, ...operatorGens) {
        this.min = minOperators;
        this.max = maxOperators;
        this.operators = operatorGens;
    }

    generate(count = 1) {
        let results = [];
        for (let i = 0; i < count; i++) {
            let len = randInt(this.min, this.max);
            if (len === 1) {
                results.push(this.operators.randElement().generate());
            }
            else if (len === 2) {
                let first = this.operators.randElement();
                let second = this.operators.randElement();
                if (randBool(0.5)) {
                    results.push(first.generate(() => second.generate()));
                }
                else {
                    results.push(first.generate(undefined, () => second.generate()));
                }
            }
        }
        return results;
    }
}