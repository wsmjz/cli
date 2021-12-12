
let path = require('path');
let  {getPromptModules} = require('./util/createTools') ;
let Creator= require('./Creator');
let {chalk, execa,loadModule} = require('zhu-cli-shared-utils');
/**
 * 创建项目
 * @param {}} projectName  项目的名称
 */
async function create(projectName){
  let cwd = process.cwd();//获取 当前的工作目录 
  let name = projectName;//项目名
  let targetDir = path.join(cwd,name)
  //获取要弹出的选项
  let promptModules = getPromptModules();
  console.log(promptModules);
  console.log(chalk.yellow('欢迎来到苹果家，以少写代码为目标，自上而下的创建重应用，覆盖常见业务诉求，并配以资产库积累个性需求'));
  console.log(chalk.yellow('最新版本3.46, 建议尽快更新, 4.0版本研发中, 欢迎提供设想'));
  console.log(chalk.yellow('推荐使用官方物料市场，npm.org/@ping'));
  console.log(chalk.green('消息通知：打通接口服务啦！！！'));
  console.log(chalk.yellow('参与共建...'));
  
  const creator  = new Creator(name,targetDir,promptModules);
  await creator.create();
}
module.exports = (...args)=>{
   return create(...args).catch(err=>{
       console.log(err);
   });
}