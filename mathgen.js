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
    RandRange:RandRange,
    RandRangeAdv:RandRangeAdv,
    OperatorGen:OperatorGen,
    Generator:Generator,
    Expression: [
        x => x instanceof Expression,
        expr => expr.source,
        source => new Expression(source)
    ],
    Rule: [
        x => x instanceof Rule,
        rule => rule.source,
        source => new Rule(source)
    ]
});

let generator = new Generator(1, 1, 10);

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
            let results = generator.generate();
            this.$Notice.open({
                title: '算式',
                desc: results.toString().replace(/,/g, '<br>'),
                duration: 0
            });
        },
        save: function () {
            let json = ts.stringify(generator);
            this.$Notice.open({
                title: 'JSON数据 - 已复制到剪贴板',
                desc: json,
                duration: 5
            });
            this.$copyText(json);
        },
        load: function (json) {
            generator = this.$root.$data.generator = ts.parse(json);
            this.$Notice.open({
                title: '已加载JSON',
                duration: 3
            });
        },
        showLoadModal: function () {
            this.$Modal.confirm({
                render: (h) => {
                    return h('Input', {
                        props: {
                            value: this.value,
                            autofocus: true,
                            placeholder: 'JSON数据',
                            type: 'textarea',
                            autosize: true
                        },
                        on: {
                            input: (val) => {
                                this.value = val;
                            }
                        }
                    })
                },
                width: 800,
                scrollable: true,
                onOk: () => this.load(this.value)
            })
        },
        removeDecimal: str => str.substr(0, str.indexOf('.'))
    }
});