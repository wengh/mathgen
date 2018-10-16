'use strict';

Array.prototype.remove = function (element) {
    for (var i = this.length - 1; i--;) {
        if (this[i] === element) this.splice(i, 1);
    }
};
Array.prototype.removeIndex = function (index) {
    this.splice(index, 1);
};

var generator = new Generator(1, 1);

var app = new Vue({
    el: '#app',
    data: {
        generator: generator
    },
    methods: {
        addOperator: function addOperator(operator) {
            generator.operators.push(new OperatorGen(Operators[operator], new RandRange(0, 100, 0, 100, false)));
        },
        generate: function generate() {
            var results = generator.generate(10);
            alert(results.toString().replace(/,/g, '\n'));
        }
    }
});
//# sourceMappingURL=mathgen.js.map