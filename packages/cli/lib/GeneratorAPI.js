

let {toShortPluginId} = require('@vue/cli-shared-utils');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const mergeDeps = require('./util/mergeDeps');
const {isBinaryFileSync} = require('isbinaryfile');
let isObject = val=>typeof val === 'object';
let isString = val=>typeof val === 'string';
class GeneratorAPI{
    /**
     * 
     * @param {*} id 插件ID
     * @param {*} generator 生成器函数 
     * @param {*} options 插件的选项
     * @param {*} rootOptions  根选项，也就是preset
     */
    constructor(id,generator,options,rootOptions){
        this.id = id;
        this.generator = generator;
        this.options = options;
        this.rootOptions = rootOptions;
        this.pluginsData = generator.plugins
        .filter(({id})=>id!=='@vue/cli-service')
        .map(({id})=>({name:toShortPluginId(id)}))
        // @vue/cli-plugin-eslint=>{name:eslint}
    }
    hasPlugin(id){
        return this.generator.hasPlugin(id);
    }
    extendPackage(fields){
        const pkg = this.generator.pkg;
        const toMerge = fields;
        for(const key in toMerge){
            const value = toMerge[key];//key=dependencies value={vue:'3'}
            let existing = pkg[key];
            if(isObject(value) && (key === 'dependencies'|| key === 'devDependencies')){
                pkg[key]= mergeDeps(existing||{},value);
            }else{
                pkg[key]= value;
            }
        }
    }
    _injectFileMiddleware(middleware){
        this.generator.fileMiddlewares.push(middleware);    
    }
    /**
     * 
     * @param {*} source 模板目录的名称
     * @param {*} additionalData 额外的数据对象
     */
    render(source,additionalData){
        //C:\aproject\zhu-cli\hello5\node_modules\@vue\cli-service\generator
        const baseDir = extractCallDir();
        if(isString(source)){
            //C:\aproject\zhu-cli\hello5\node_modules\@vue\cli-service\generator/template
            source = path.resolve(baseDir,source);
            //此处只是暂存中间件函数，并没有执行
            this._injectFileMiddleware(async (files)=>{
                const data = this._resolveData(additionalData);
                let globby = require('globby');
                let _files = await globby(['**/*'],{cwd:source});
                console.log('_files',_files);
                for(const rawPath of _files){
                    const targetPath = rawPath.split('/').map(field=>{
                        if(field.charAt(0)=='_'){//_gitignore -> .gitignore
                            return `.${field.slice(1)}`
                        }
                        return field;
                    }).join('/');
                    //模板文件夹里原始文件的绝对路径
                    const sourcePath = path.resolve(source,rawPath);
                    debugger
                    const content  = renderFile(sourcePath,data);
                    //不管是二进制还是普通 的文本文件都暂存到files对象上去
                    files[targetPath]=content;
                }
            });
        }
    }
    _resolveData(additionalData){
        return Object.assign({
            options:this.options,//此插件对应的配置对象
            rootOptions:this.rootOptions,//根配置，preset
            plugins:this.pluginsData,
        },additionalData);
    }
}
function renderFile(name,data){
    debugger
    if(isBinaryFileSync(name)){
        return fs.readFileSync(name);
    }
    let template = fs.readFileSync(name,'utf8');
    //template = template.replace(/_/g,'');
    return  ejs.render(template,data);

}
function extractCallDir() {
    const obj = {}
    Error.captureStackTrace(obj)
    const callSite = obj.stack.split('\n')[3]
    const namedStackRegExp = /\s\((.*):\d+:\d+\)$/
    let matchResult = callSite.match(namedStackRegExp)
    const fileName = matchResult[1]
    return path.dirname(fileName)
}

module.exports = GeneratorAPI;
//@vue/cli create-react-app