
const inquirer = require('inquirer');
let { defaults } = require('./options');
let PromptModuleAPI = require('./PromptModuleAPI');
let writeFileTree = require('./util/writeFileTree');
let cloneDeep = require('lodash.clonedeep');
let { chalk, execa, loadModule } = require('zhu-cli-shared-utils');
let Generator = require('./Generator');
const isManualMode = answers => answers.preset === '__manual__';
class Creator {
	constructor(name, context, promptModules) {
		this.name = name;
		this.context = context;
		const { presetPrompt, featurePrompt } = this.resolveIntroPrompts()
		this.presetPrompt = presetPrompt;//presetPrompt对象有几个属性key??
		this.featurePrompt = featurePrompt;//现在这里的选项是一个空数组
		//当前选择了某个特性后，这个特性可能会添加新的选择项 unit test  jest mocha  vueVersion 2 3
		this.injectedPrompts = [];
		this.promptCompleteCbs = [];//当选择完所有的选项后执行的回调数组
		this.run = this.run.bind(this);
		const PromptAPI = new PromptModuleAPI(this);
		promptModules.forEach(m => m(PromptAPI));
	}
	run(command, args) {
		//在context目录下执行命令
		return execa(command, args, { cwd: this.context });
	}
	async create() {
		const { name, context } = this;//name要创建的项目名 context所在
		let preset = await this.promptAndResolvePreset();
		console.log(preset);//{plugins:{},vueVersion:'3'}
		preset = cloneDeep(preset);
		//@vue/cli-service是核心包，里面自带webpack配置，以及build serve等命令
		//vue/cli-service非常特殊，它的选项也被称为项目的选项，或者说根选 rootOptions
		preset.plugins['@vue/cli-service'] = Object.assign({ projectName: name }, preset);
		console.log(`✨  Creating project in ${chalk.yellow(context)}.`);
		const pkg = {//将要生成的项目的package.json的内容
			name,
			version: '0.1.0',
			private: true,
			devDependencies: {}
		}
		const deps = Object.keys(preset.plugins);//'@vue/cli-service'
		deps.forEach(dep => {
			pkg.devDependencies[dep] = 'latest';//getVersion()
		});

		await writeFileTree(context, {
			'package.json': JSON.stringify(pkg, null, 2)
		});
		console.log(`🗃  Initializing git repository...`)
		await this.run('git init');//初始化git仓库
		console.log(`⚙\u{fe0f} Installing CLI plugins. This might take a while...`)
		await this.run('npm install');//安装依赖的模块
		console.log(`🚀  Invoking generators...`)//调用生成器
		const plugins = await this.resolvePlugins(preset.plugins);
		console.log(plugins);//[{id,apply,options}]
		const generator = new Generator(context, { pkg, plugins });
		await generator.generate();//生成代码
	}
	async resolvePlugins(rawPlugins) {//{'@vue/cli-service':{}}
		const plugins = [];
		for (const id of Object.keys(rawPlugins)) {//['@vue/cli-service]
			//const apply  = require(`@vue/cli-service/generator`);
			const apply = loadModule(`${id}/generator`, this.context);
			let options = rawPlugins[id];
			//{id:'@vue/cli-service',apply:插件里的generator导出的文件导出的函数,option}
			plugins.push({ id, apply, options });
		}
		return plugins;
	}
	resolvePreset(name) {
		return this.getPresets()[name];
	}
	resolveFinalPrompts() {
		this.injectedPrompts.forEach(prompt => {
			let originWhen = prompt.when || (() => true);
			prompt.when = answers => {
				//如果是手工模式并且answers里有vueVersion特性的话才会弹出来
				return isManualMode(answers) && originWhen(answers);
			}
		});
		let prompts = [
			this.presetPrompt,//先让你选预设 default default vue3 manual
			this.featurePrompt,//再让你选特性  feature
			...this.injectedPrompts,//不同的promptModule插入的选项
		]
		return prompts;
	}
	async promptAndResolvePreset() {
		let answers = await inquirer.prompt(this.resolveFinalPrompts());
		let preset;
		if (answers.preset && answers.preset !== '__manual__') {//如果不是手工选择的话 
			preset = await this.resolvePreset(answers.preset);
		} else {
			preset = {//如果是手工选项的
				plugins: {}//默认没有任何插件
			}
			answers.features = answers.features || [];
			this.promptCompleteCbs.forEach(cb => cb(answers, preset));
		}
		return preset;
	}
	getPresets() {
		return Object.assign({}, defaults);
	}
	resolveIntroPrompts() {
		let presets = this.getPresets();
		const presetChoices = Object.entries(presets).map(([name]) => {
			let displayName = name
			if (name === 'default') {
				displayName = 'Default'
			} else if (name === '__default_vue_3__') {
				displayName = 'Default (Vue 3)'
			}
			return {
				name: `${displayName}`,
				value: name
			}
		})
		//presetChoices=[{name:'Default',value:'default'},{name:'Default (Vue 3)'，value:'__default_vue_3__'}]
		const presetPrompt = {
			name: 'preset',//弹出项的名称 preset
			type: 'list',//如何选择 列表
			message: `请选择一个预设:`,//请选择一个预设
			choices: [
				...presetChoices,
				{
					name: '自定义配置',//手工选择特性
					value: '__manual__'
				}
			]
		}
		const featurePrompt = {
			name: 'features',//弹出项的名称 features 手工选择的特性
			when: isManualMode,//如果when这个函数的返回值是true,就会弹出这个框，否则不弹这个框
			type: 'checkbox',//复选框
			message: '配置以下特性:',//手工你这个项目支持的特性
			choices: []
		}
		return { presetPrompt, featurePrompt };
	}

}

module.exports = Creator;