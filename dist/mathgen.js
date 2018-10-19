"use strict";

Array.prototype.remove = function (element) {
    for (var i = this.length - 1; i--;) {
        if (this[i] === element) this.splice(i, 1);
    }
};
Array.prototype.removeIndex = function (index) {
    this.splice(index, 1);
};

function uploadToPastebin(data) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console.log;

    var body = "api_dev_key=1dfd342af2837432ca84ba4374e44a33" + "&api_option=paste" + "&api_paste_code=" + encodeURIComponent(data) + "&api_paste_private=1" + "&api_paste_format=json" + "&api_paste_expire_date=N" + "&api_paste_name=mathgen%20data";

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            callback(this.responseText);
        }
    });

    xhr.open("POST", "https://pastebin.com/api/api_post.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("Postman-Token", "a0bd0ab3-7799-4c25-ae5a-1c636152b15e");

    xhr.send(body);
}

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
var hist = [];

var app = new Vue({
    el: '#app',
    data: {
        generator: generator,
        hist: hist
    },
    methods: {
        addOperator: function addOperator(operator) {
            generator.operators.push(new OperatorGen(operator, new RandRange(0, 100, 0, 100, false)));
        },
        generate: function generate() {
            var results = generator.generate();
            this.hist.push(results);
            this.$Message.success("\u6210\u529F\u751F\u6210" + results.length + "\u4E2A\u7B97\u5F0F");
        },
        save: function save() {
            var json = ts.stringify(generator);
            this.$Notice.open({
                title: 'JSON数据 - 已复制到剪贴板',
                desc: json
            });
            this.$copyText(json);
        },
        load: function load(json) {
            generator = this.$root.$data.generator = ts.parse(json);
            this.$Notice.open({
                title: '已加载JSON'
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
        },
        print: function print(index) {
            printJS({
                printable: 'history' + index.toString(),
                type: 'html',
                scanStyles: false,
                css: 'print.css'
            });
        },
        firstHalf: function firstHalf(list) {
            return list.slice(0, Math.floor(list.length / 2));
        },
        lastHalf: function lastHalf(list) {
            return list.slice(Math.floor(list.length / 2));
        }
    }
});
//# sourceMappingURL=mathgen.js.map