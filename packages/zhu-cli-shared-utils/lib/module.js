const Module = require('module');
const path = require('path');
/**
 * 
 * @param {*} request @vue/cli-service/generator
 * @param {*} context  C:\aproject\zhu-cli\hello1
 * @returns 
 */
exports.loadModule = function(request,context){
    //创建一个 require方法v @vue/cli-service/generator
  return Module.createRequire(path.resolve(context,'package.json'))(request);
}