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
        if (isNaN(source)) {
            this.expression = parser.parse(source);
            this.isNumber = false;
        }
        else {
            this.expression = Number(source);
            this.isNumber = true;
        }
    }

    value(variables = {}) {
        return this.isNumber ? this.expression : this.expression.evaluate(variables);
    }
}

class RandRange {
    constructor(minA, maxA, minB, maxB, bFirst = false) {
        this.minA = new Expression(minA);
        this.maxA = new Expression(maxA);
        this.minB = new Expression(minB);
        this.maxB = new Expression(maxB);
        this.bFirst = bFirst;
    }

    generate(a = undefined, b = undefined) {
        if (a !== undefined && b !== undefined) {
            return [a, b];
        }
        else if (a === undefined && b === undefined) {
            if (this.bFirst) {
                b = randInt(this.minB.value(), this.maxB.value());
            }
            else {
                a = randInt(this.minA.value(), this.maxA.value());
            }
        }
        if (a !== undefined) {
            b = randInt(this.minB.value({a: a}), this.maxB.value({a: a}));
            return [a, b];
        }
        else if (b !== undefined) {
            a = randInt(this.minA.value({b: b}), this.maxA.value({b: b}));
        }
        return [a, b];
    }
}

class RandRangeAdv extends RandRange {
    constructor(minA, maxA, minB, maxB, expression, target, BFirst = false) {
        super(minA, maxA, minB, maxB, BFirst);
        this.expression = parser.parse(expression);
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
}

class Rule {
    constructor(condition) {
        this.condition = parser.parse(condition);
    }

    validate(variables = {}) {
        return this.condition.evaluate(variables);
    }
}

class OperatorGen {
    constructor(operator, range, ...rules) {
        this.operator = operator;
        this.range = range;
        this.rules = rules;
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
        while (!this.rules.every(x => x.validate(variables)) && i <= 1000);
        if (i >= 1000) {
            return undefined;
        }
        return new this.operator(a, b);
    }
}

class Generator {
    constructor(minOperators, maxOperators, ...operatorGens) {
        this.min = minOperators;
        this.max = maxOperators;
        this.generators = operatorGens;
    }

    generate(count = 1) {
        let results = [];
        for (let i = 0; i < count; i++) {
            let len = randInt(this.min, this.max);
            if (len === 1) {
                results.push(this.generators.randElement().generate());
            }
            else if (len === 2) {
                let first = this.generators.randElement();
                let second = this.generators.randElement();
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

let vm = new Vue({
    // 选项
});