'use strict';

Array.prototype.remove = function (element) {
    for (var i = this.length - 1; i--;) {
        if (this[i] === element) this.splice(i, 1);
    }
};
Array.prototype.removeIndex = function (index) {
    this.splice(index, 1);
};

var ts = new Typeson().register({
    Operator: Operator,
    Addition: Addition,
    Subtraction: Subtraction,
    Multiplication: Multiplication,
    Division: Division,
    RandRange: RandRange,
    RandRangeAdv: RandRangeAdv,
    OperatorGen: OperatorGen,
    Generator: Generator,
    Expression: [function (x) {
        return x instanceof Expression;
    }, function (expr) {
        return expr.source;
    }, function (source) {
        return new Expression(source);
    }],
    Rule: [function (x) {
        return x instanceof Rule;
    }, function (rule) {
        return rule.source;
    }, function (source) {
        return new Rule(source);
    }]
});

var generator = new Generator(1, 1, 10);

var app = new Vue({
    el: '#app',
    data: {
        generator: generator
    },
    methods: {
        addOperator: function addOperator(operator) {
            generator.operators.push(new OperatorGen(operator, new RandRange(0, 100, 0, 100, false)));
        },
        generate: function generate() {
            var results = generator.generate();
            this.$Notice.open({
                title: '算式',
                desc: results.toString().replace(/,/g, '<br>'),
                duration: 0
            });
        },
        save: function save() {
            var json = ts.stringify(generator);
            this.$Notice.open({
                title: 'JSON数据 - 已复制到剪贴板',
                desc: json,
                duration: 5
            });
            this.$copyText(json);
        },
        load: function load(json) {
            generator = this.$root.$data.generator = ts.parse(json);
            this.$Notice.open({
                title: '已加载JSON',
                duration: 3
            });
        },
        showLoadModal: function showLoadModal() {
            var _this = this;

            this.$Modal.confirm({
                render: function render(h) {
                    return h('Input', {
                        props: {
                            value: _this.value,
                            autofocus: true,
                            placeholder: 'JSON数据',
                            type: 'textarea',
                            autosize: true
                        },
                        on: {
                            input: function input(val) {
                                _this.value = val;
                            }
                        }
                    });
                },
                width: 800,
                scrollable: true,
                onOk: function onOk() {
                    return _this.load(_this.value);
                }
            });
        },
        removeDecimal: function removeDecimal(str) {
            return str.substr(0, str.indexOf('.'));
        }
    }
});
//# sourceMappingURL=mathgen.js.map