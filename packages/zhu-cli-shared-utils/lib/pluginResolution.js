
const pluginRE = /^@vue\/cli-plugin-/;
exports.isPlugin=(id)=>{// @vue/cli-plugin-eslint
  return pluginRE.test(id);
}
exports.toShortPluginId = function(id){
  return id.replace(pluginRE,'');//@vue/cli-plugin-eslint => eslint 
}