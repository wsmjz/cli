//提取调用目录
const path = require('path');
function extractCallDir() {
    const obj = {}
    Error.captureStackTrace(obj)
    console.log(obj.stack);
    const callSite = obj.stack.split('\n')[2]
    const namedStackRegExp = /\s\((.*):\d+:\d+\)$/
    let matchResult = callSite.match(namedStackRegExp)
    const fileName = matchResult[1]
    return path.dirname(fileName)
}

let result = extractCallDir();
console.log(result);