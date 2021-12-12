const { existsSync, readFileSync, writeFileSync } = require('fs');
const { EOL } = require('os');

function isTs(api) {
  const tsPath = api.resolve('src/main.ts');
  return existsSync(tsPath);
}

module.exports = api => {
  api.extendPackage({
    dependencies: {
      'vue3-libs': '^0.1.5'
    }
  });
  
  api.injectImports(api.entryFile, `import installAntui from './plugins/antui';`);
  
  const antuiFile = isTs(api) ? {
    './src/plugins/antui.ts': './templates/src/plugins/antui.ts'
  } : {
    './src/plugins/antui.js': './templates/src/plugins/antui.js'
  }
  
  api.render({
    ...antuiFile,
    './src/App.vue': './templates/src/App.vue',
    './src/components/formDemo.vue': './templates/src/components/formDemo.vue',
    './src/components/messageDemo.vue': './templates/src/components/messageDemo.vue',
    './src/components/tabsDemo.vue': './templates/src/components/tabsDemo.vue'
  });
  
  api.afterInvoke(() => {
    const contentMain = readFileSync(api.resolve(api.entryFile), { encoding: 'utf-8' });
    const lines = contentMain.split(/\r?\n/g);
    const renderIndex = lines.findIndex(line => line.match(/createApp\(App\)\.mount\('#app'\)/));
    lines[renderIndex] = `const app = createApp(App)`;
    lines[renderIndex + 1] = `installAntui(app)`;
    lines[renderIndex + 2] = `app.mount('#app')`;
    writeFileSync(api.entryFile, lines.join(EOL), { encoding: 'utf-8' })
  });
}
