let fs = require('fs-extra');
const path = require('path');
module.exports = async function(dir,files){
   Object.keys(files).forEach(name=>{
       const filePath = path.join(dir,name);
       fs.ensureDirSync(path.dirname(filePath));//先确保文件所在的目录 是存在
       fs.writeFileSync(filePath,files[name]);
   });
}