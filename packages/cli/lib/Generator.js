
let {isPlugin} = require('zhu-cli-shared-utils')
let GeneratorAPI = require('./GeneratorAPI');
let normalizeFilePaths = require('./util/normalizeFilePaths'); 
let writeFileTree = require('./util/writeFileTree');
let  ejs = require('ejs');

// 每个插件决定要生成的东西！！！
class Generator{
    /**
     * 
     * @param {*} context 项目目录 
     * @param {*} pkg 项目的package.json内容
     *           plugins [{id,apply,options}]
     */
    constructor(context,{pkg={},plugins=[]}){
        this.context = context;
        this.plugins = plugins;// [{id,apply,options}]
        this.files = {};//生成器先把所有要生成的文件和文件内容放在files对象
        //生成文件的中间件,每个插件都会向中间件里插入中间件
        //然后中间会负责往this.files里写文件
        this.fileMiddlewares = [];
        this.pkg = pkg;
        this.allPluginIds = Object.keys(this.pkg.dependencies||{}).concat(Object.keys(this.pkg.devDependencies||{})).filter(isPlugin)//[]
        const cliService = this.plugins.find(p=>p.id === '@vue/cli-service');
        this.rootOptions = cliService?cliService.options:{};//cliService的配置对象就是preset,也就是根配置
    }
    async generate(){
        console.log('开始真正生成文件和配置了');
        await this.initPlugins();//初始化插件，修改fileMiddlewares和pkg
        this.extractConfigFiles();//提取package.json里的配置文件到单独的文件里去
        await this.resolveFiles();
        this.sortPkg();
        //更新package.json文件，天加新的依赖或者命令
        this.files['package.json'] = JSON.stringify(this.pkg,null,2);
        console.log('安装额外的依赖模块 npm install');// npm install
        //安装额外的依赖模块 npm install
        await writeFileTree(this.context,this.files);
    }
    hasPlugin(_id){
        return [
        ...this.plugins.map(p=>p.id),
        ...this.allPluginIds
        ].some(id=>id===_id);
    }
    sortPkg(){
        console.log('对依赖包进行排序');
    }
    //真正执行中间件
    async resolveFiles(){
        for(const middleware of this.fileMiddlewares){
            await middleware(this.files,ejs.render);
        }
        normalizeFilePaths(this.files);
    }
    extractConfigFiles(){
        console.log('提取package.json里的配置文件到单独的文件里去');
    }
    async initPlugins(){
        let {rootOptions} = this;
        for(const plugin of this.plugins){
            const {id,apply,options} = plugin;
            //为每个插件创建一个GeneratorAPI对象
            const api = new GeneratorAPI(id,this,options,rootOptions);
            await apply(api,options,rootOptions);
        }
    }
}

module.exports = Generator;