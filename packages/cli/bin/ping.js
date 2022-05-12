#!/usr/bin/env node
const program = require('commander');

// 支持以下命令
// 1. create 创建各类型项目 vue react H5
// 2. block 创建区块
// 3. plugin 安装插件
// 4. loader 安装loader
// 5. list help 查看命令列表, 帮助
// 6. v 查看版本

program
  .version(`1.4.2`)//可以指定版本号
  .usage('<command> [options]')//可以指定使用方式 命令 参数

program
  .command('create <app-name>')
  .description('欢迎使用苹果家cli构建项目')  // create a new project powered by vue-cli-service
  .action((appName) => {
    require('../lib/create')(appName);
  })
program
  .command('c <app-name>')
  .description('欢迎使用苹果家cli构建项目')
  .action((appName) => {
    require('../lib/create')(appName);
  })

program
  .command('list')
  .description('查看命令列表')
  .action((appName) => {
    console.log('create');
    console.log('block');
    console.log('page');
    console.log('add', "安装插件");
  })

program
  .command('block <block-name>')
  .action((blockName) => {
    console.log(`开始安装 ${blockName} 区块，请稍后....................`);
  })

program
  .command('page <page-name>')
  .action((pageName) => {
    console.log(`开始创建 ${pageName} 页面，请稍后....................`);
  })

program
  .command('add <plugin-name>')
  .action((pluginName) => {
    console.log(`开始安装 ${pluginName} 插件，请稍后....................`);
  })

program.parse(process.argv)