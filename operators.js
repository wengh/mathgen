Object.defineProperty(Number.prototype, 'priority', {
    get: () => 1000
});
Number.prototype.evaluate = function () {
    return this;
};

class Operator {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    toString() {
        return `${this.a.toString()} ${this.b.toString()}`;
    }

    format(symbol, parenthesesA, parenthesesB) {
        let result = '';
        if (parenthesesA) {
            result += '(' + this.a.toString() + ')';
        }
        else {
            result += this.a.toString();
        }
        result += ' ' + symbol + ' ';
        if (parenthesesB) {
            result += '(' + this.b.toString() + ')';
        }
        else {
            result += this.b.toString();
        }
        return result;
    }

    evaluate() {
        return 0;
    }

    get priority() {
        return 0;
    }

    get floorPriority() {
        return Math.floor(this.priority / 10) * 10;
    }

    static get symbol() {
        return ' ';
    }

    static get locName() {
        return '运算符';
    }
}

class Addition extends Operator {
    constructor(a, b) {
        super(a, b);
    }

    toString() {
        return this.format('+', false, this.b.priority < this.priority);
    }

    evaluate() {
        return this.a.evaluate() + this.b.evaluate();
    }

    get priority() {
        return 5;
    }

    static get symbol() {
        return '+';
    }

    static get locName() {
        return '加法';
    }
}

class Subtraction extends Operator {
    constructor(a, b) {
        super(a, b);
    }

    toString() {
        return this.format('-', false, this.b.priority <= this.priority);
    }

    evaluate() {
        return this.a.evaluate() - this.b.evaluate();
    }

    get priority() {
        return 4;
    }

    static get symbol() {
        return '-';
    }

    static get locName() {
        return '减法';
    }
}

class Multiplication extends Operator {
    constructor(a, b) {
        super(a, b);
    }

    toString() {
        return this.format('*', this.a.priority < this.floorPriority, this.b.priority < this.priority);
    }

    evaluate() {
        return this.a.evaluate() * this.b.evaluate();
    }

    get priority() {
        return 15;
    }

    static get symbol() {
        return '*';
    }

    static get locName() {
        return '乘法';
    }
}

class Division extends Operator {
    constructor(a, b) {
        super(a, b);
    }

    toString() {
        return this.format('/', this.a.priority < this.floorPriority, this.b.priority <= this.priority);
    }

    evaluate() {
        return this.a.evaluate() / this.b.evaluate();
    }

    get priority() {
        return 14;
    }

    static get symbol() {
        return '/';
    }

    static get locName() {
        return '除法';
    }
}

const Operators = {
    addition: Addition,
    subtraction: Subtraction,
    multiplication: Multiplication,
    division: Division
};