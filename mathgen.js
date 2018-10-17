Array.prototype.remove = function(element) {
    for(let i = this.length-1; i--;) {
        if(this[i] === element) this.splice(i, 1);
    }
};
Array.prototype.removeIndex = function(index) {
    this.splice(index, 1);
};

const ts = new Typeson().register({
    Operator:Operator,
    Addition:Addition,
    Subtraction:Subtraction,
    Multiplication:Multiplication,
    Division:Division,
    Expression:Expression,
    RandRange:RandRange,
    RandRangeAdv:RandRangeAdv,
    Rule:Rule,
    OperatorGen:OperatorGen,
    Generator:Generator
});

const generator = new Generator(1, 1);

const app = new Vue({
    el: '#app',
    data: {
        generator: generator,
    },
    methods: {
        addOperator: function (operator) {
            generator.operators.push(new OperatorGen(operator, new RandRange(0, 100, 0, 100, false)));
        },
        generate: function () {
            let results = generator.generate(10);
            this.$Notice.open({
                title: '算式',
                desc: results.toString().replace(/,/g, '\n'),
                duration: 0
            });
        },
        save: function () {
            let json = ts.stringify(generator.operators);
            this.$Notice.open({
                title: 'JSON数据 - 已复制到剪贴板',
                desc: json,
                duration: 5
            });
            this.$copyText(json);
        }
    }
});