

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
    'react-console': Object.assign({ applyType: 'react-console' }, exports.defaultPresetOfReact),
    'vue2-console': Object.assign({ vueVersion: 'vue2-console' }, exports.defaultPreset),//vue2
    'vue3-console': Object.assign({ vueVersion: 'vue2-console' }, exports.defaultPreset),
    'H5-响应式官网': Object.assign({ applyType: 'H5' }, exports.defaultPresetOfReact),
    '小程序': Object.assign({ applyType: 'xcx' }, exports.defaultPresetOfReact),
    '跨端应用': Object.assign({ applyType: 'taro' }, exports.defaultPresetOfReact),
    '桌面应用': Object.assign({ applyType: 'electron' }, exports.defaultPresetOfReact)
}