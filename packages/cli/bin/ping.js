#!/usr/bin/env node
const program = require('commander');
program
  .version(`ping 0.0.0}`)//可以指定版本号
  .usage('<command> [options]')//可以指定使用方式 命令 参数


// 支持以下命令
// 1. create 创建各类型项目 vue react H5
// 2. block 创建区块
// 3. plugin 安装插件
// 4. loader 安装loader
// 5. list help 查看命令列表, 帮助
// 6. v 查看版本
program
  .command('create <app-name>') //添加一个命令 create <表示必选参数>
  .description('create a new project powered by vue-cli-service')
  .action((appName) => {
    require('../lib/create')(appName);
  })
program
  .command('list')
  .description('查看命令列表')
  .action((appName) => {
    console.log('create');
    console.log('block');
  })
program
  .command('block <block-name>')
  .action((blockName) => {
    console.log(`开始安装 ${blockName} 区块，请稍后....................`);
  })
program.parse(process.argv)