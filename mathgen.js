Array.prototype.remove = function(element) {
    for(let i = this.length-1; i--;) {
        if(this[i] === element) this.splice(i, 1);
    }
};
Array.prototype.removeIndex = function(index) {
    this.splice(index, 1);
};

const generator = new Generator(1, 1);

const app = new Vue({
    el: '#app',
    data: {
        generator: generator,
    },
    methods: {
        addOperator: function (operator) {
            generator.operators.push(new OperatorGen(Operators[operator], new RandRange(0, 100, 0, 100, false)));
        },
        generate: function () {
            let results = generator.generate(10);
            alert(results.toString().replace(/,/g, '\n'));
        }
    }
});