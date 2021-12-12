
function mergeDeps(sourceDeps,depsToInject){
    let result = Object.assign({},sourceDeps);
    for(const depName in depsToInject){
        //result[vue]=3.0
        result[depName]= depsToInject[depName];
    }
    return result;
    //return Object.assign(sourceDeps,depsToInject);
}
module.exports = mergeDeps;