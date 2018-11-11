'use strict';

Array.prototype.removeIndex = function (index) {
    this.splice(index, 1);
};
String.prototype.afterLast = function (separator) {
    var index = this.lastIndexOf(separator);
    if (index !== -1) {
        return this.slice(index + 1);
    } else {
        return null;
    }
};
String.prototype.trimEnd = function (char) {
    return this.replace(new RegExp('\\' + char + '+$', 'g'), '');
};

function uploadJSON(json) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console.log;

    var data = JSON.stringify(json);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
            callback(JSON.parse(this.responseText).uri);
        }
    });
    xhr.open('POST', 'https://api.myjson.com/bins');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('cache-control', 'no-cache');
    xhr.send(data);
}
function downloadJSON(id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console.log;

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
            callback(this.responseText);
        }
    });
    xhr.open('GET', 'https://api.myjson.com/bins/' + id);
    xhr.send();
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
        hist: hist,
        showHelp: false
    },
    methods: {
        addOperator: function addOperator(operator) {
            generator.operators.push(new OperatorGen(operator, new RandRange(0, 100, 0, 100, false)));
        },
        generate: function generate() {
            var results = generator.generate();
            this.hist.push(results);
            this.$Message.success('\u6210\u529F\u751F\u6210' + results.length + '\u4E2A\u7B97\u5F0F');
        },
        save: function save() {
            var json = ts.stringify(generator);
            this.$copyText(json);
            this.$Notice.open({
                title: 'JSON数据 - 已复制到剪贴板',
                desc: json
            });
        },
        load: function load(json) {
            generator = this.generator = ts.parse(json);
            this.$Message.success('已加载JSON');
        },
        download: function download(id) {
            var _this = this;

            downloadJSON(id, function (json) {
                return _this.load(json);
            });
        },
        showLoadModal: function showLoadModal() {
            var _this2 = this;

            this.$Modal.confirm({
                render: function render(h) {
                    return h('Input', {
                        props: {
                            value: _this2.value,
                            autofocus: true,
                            placeholder: 'JSON数据',
                            type: 'textarea',
                            autosize: true
                        },
                        on: {
                            input: function input(val) {
                                _this2.value = val;
                            }
                        }
                    });
                },
                width: 800,
                scrollable: true,
                onOk: function onOk() {
                    return _this2.load(_this2.value);
                }
            });
        },
        share: function share() {
            var _this3 = this;

            uploadJSON(ts.encapsulate(generator), function (link) {
                return Vue.nextTick(function () {
                    console.log(link);
                    link = 'https://wenghy.me/mathgen/?' + link.trimEnd('/').afterLast('/');
                    _this3.$Modal.confirm({
                        title: '分享成功!',
                        content: link,
                        okText: '复制链接',
                        onOk: function onOk() {
                            _this3.$copyText(link);
                        }
                    });
                });
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

var params = window.location.href.afterLast('?');
if (params != null) {
    app.download(params);
}
//# sourceMappingURL=mathgen.js.map