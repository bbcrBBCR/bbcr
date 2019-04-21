/* 将hello.pas文件进行词法分析，输出hello.dyd文件和hello.err文件储存分析结果以及错误信息*/
/*基于node实现*/

var fs = require('fs');//引入读文件模块
var resultarr = [],//储存二元式
    errarr = [],//储存错误
    line = 0;//行号
fs.readFile('hello.pas', 'utf-8', function (err, data) {
    if (err) {
        //读文件失败
        console.log('false');
    } else {
        //读文件成功，开始词法分析
        cffx(data);
    }
    //写dyd文件
    fs.writeFile('hello.dyd', resultarr.join('\r\n'), function () { console.log('dyd ok') });
    //写err文件
    fs.writeFile('hello.err', errarr.join('\r\n'), function () { console.log('err ok') });
});

function cffx(data) {
    var dataarr = data.split(/\r\n/);//元素为每一行的内容
    for (var i = 0; i < dataarr.length; i++) {
        var node = dataarr[i];
        if (node == '') {
            //清除空字符
            continue;
        }
        line += 1;
        //分析每一行的结点
        other(node);
        //行结束
        resultarr.push('            EOLN 24');
    }
    //分析结束
    resultarr.push('             EOF 25');
}

//处理文件中的每一行
function other(node) {
    var nodearr = node.split(/\s+/);//分割成一个个字符
    var result = [];//储存每一个结果
    for (var i = 0; i < nodearr.length; i++) {
        var nodearrnode = nodearr[i];
        if (nodearrnode == '') {
            continue;
        }
        if (result.length !== 0) {
            //追加上一次分析的结果到resultarr中，并且清空resul
            add(result, resultarr);
            result = [];
        }
        //对于不同的内容先result追加不同的内容
        switch (nodearrnode) {
            case 'begin': {
                result.push('           begin 01');
                break;
            };
            case 'end': {
                result.push('             end 02');
                break;
            };
            case 'integer': {
                result.push('         integer 03');
                break;
            };
            case 'if': {
                result.push('              if 04');
                break;
            };
            case 'then': {
                result.push('            then 05');
                break;
            };
            case 'else': {
                result.push('            else 06');
                break;
            };
            case 'function': {
                result.push('        function 07');
                break;
            };
            case 'read': {
                result.push('            read 08');
                break;
            };
            case 'write': {
                result.push('           write 09');
                break;
            };
            default: {
                ////处理非关键字与符号
                hanother(nodearrnode);
                break;
            }
        }
    }
    if (result.length !== 0) {
        //处理最后的result内容到resultarr中
        add(result, resultarr);
        result = [];
    }
}

//处理每一行中非关键字
function hanother(node) {
    var arr = node.split(''),
        result = [];
    for (var i = 0; i < arr.length; i++) {
        if (/[a-zA-Z0-9]/.test(arr[i])) {
            //当前字符为标识符时
            if (result.length == 0) {
                //初始化result
                result = [arr[i]];
                continue;
            }
            if (/[a-zA-Z0-9]/.test(result[result.length - 1])) {
                //当前字符为数字或者字母
                result.push(arr[i]);
            } else {
                if (result[result.length - 1] == ':') {
                    //冒号不匹配错误
                    result = [arr[i]];
                    errarr.push('***LINE:' + line + '  02');
                } else {
                    add(result, resultarr);
                    result = [arr[i]];
                }
            }
        } else {
            //当前字符为符号
            if (/[\=\<\>\-\*\:\;\(\)]/.test(arr[i])) {
                if (result.length > 1) {
                    add(result, resultarr);
                    result = [arr[i]];
                } else {
                    if (result.length == 0) {
                        result.push(arr[i]);
                    } else {
                        if (result[0] == ':') {
                            if (arr[i] == '=') {
                                result.push('=');
                            } else {
                                //冒号错误
                                result = [arr[i]];
                                errarr.push('***LINE:' + line + '  02');
                            }
                        } else {
                            var str = result[0] + arr[i];
                            if (/(\<\>)|(\<\=)|(\>\=)/.test(str)) {
                                result.push(arr[i]);
                            } else {
                                add(result);
                                result = [arr[i]];
                            }
                        }
                    }
                }
            } else {
                //遇到非法字符，将之前的追加到结果，清除result
                add(result);
                result = [];
                errarr.push('***LINE:' + line + '  01');
            }
        }
    }
    if (result.length !== 0) {
        //处理最后的result
        add(result, resultarr);
        result = [];
    }
}

//格式化将result内容加到resultarr中,清空result
function add(result) {
    var str = result.join('');
    switch (true) {
        case /^[a-zA-Z]+$/.test(str): {
            result.push(' 10');
            break;
        };
        case str / 1 == str: {
            result.push(' 11');
            break;
        };
        case str == '=': {
            result.push(' 12');
            break;
        };
        case str == '<>': {
            result.push(' 13');
            break;
        };
        case str == '<=': {
            result.push(' 14');
            break;
        };
        case str == '<': {
            result.push(' 15');
            break;
        };
        case str == '>=': {
            result.push(' 16');
            break;
        };
        case str == '>': {
            result.push(' 17');
            break;
        };
        case str == '-': {
            result.push(' 18');
            break;
        };
        case str == '*': {
            result.push(' 19');
            break;
        };
        case str == ':=': {
            result.push(' 20');
            break;
        };
        case str == '(': {
            result.push(' 21');
            break;
        };
        case str == ')': {
            result.push(' 22');
            break;
        };
        case str == ';': {
            result.push(' 23');
            break;
        }
    }
    if (result[0].length !== 19) {
        for (var i = result.length; i <= 16; i++) {
            result.unshift(' ');
        }
    }
    resultarr.push(result.join(''));
}
