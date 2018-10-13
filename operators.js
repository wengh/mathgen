Object.defineProperty(Number.prototype, "priority", {
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
    };

    get floorPriority() {
        return Math.floor(this.priority / 10) * 10;
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
    };
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
    };
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

    static get priority() {
        return 14;
    }
}

const Operators = [Addition, Subtraction, Multiplication, Division];

const OperatorsEnum = {
    addition: 1,
    subtraction: 2,
    multiplication: 4,
    division: 8
};