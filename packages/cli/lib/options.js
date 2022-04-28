

exports.defaultPreset = {
    useConfigFiles: false,//是否把babel eslint postcss这些包对应的配置项是否要放在单独的文件,false的话是放在package.json里
    cssPreprocessor: undefined,//默认没有配置css预处理器
    plugins: {
        '@vue/cli-plugin-babel': {},//babel   官方插件的前缀是固定的 @vue/cli-plugin- 
        '@vue/cli-plugin-eslint': {//eslint
            config: 'base',
            lintOn: ['save']//保存的时候进行lint检查 
        }
    }
}

exports.defaultPresetOfReact = {
    useConfigFiles: false,//是否把babel eslint postcss这些包对应的配置项是否要放在单独的文件,false的话是放在package.json里
    cssPreprocessor: undefined,//默认没有配置css预处理器
    plugins: {
        '@ping-home/sailfish-cli-plugin-land': {},// 项目文件目录 模板插件
        // '@ping-home/rice': {} // 驱动内核 约定路由 此处安装的包 必须具有 generator 文件
    }
}

exports.defaults = {
    'default': Object.assign({ vueVersion: '2' }, exports.defaultPreset),//vue2
    '__default_vue_3__': Object.assign({ vueVersion: '3' }, exports.defaultPreset),
    '中后台-react': Object.assign({ applyType: 'console' }, exports.defaultPresetOfReact),
    'H5-响应式官网': Object.assign({ applyType: 'H5' }, exports.defaultPresetOfReact),
    '小程序': Object.assign({ applyType: 'xcx' }, exports.defaultPresetOfReact),
    '桌面应用': Object.assign({ applyType: 'cro' }, exports.defaultPresetOfReact)
}