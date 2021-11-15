const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const pages = {}
const js = []

const chromeName = ['popup']
chromeName.forEach(name => {
  pages[name] = {
    entry: `src/pages/${name}/main.js`,
    template: 'public/index.html',
    filename: `${name}.html`
  }
})

const chromeJs = ['background', 'content_script']
chromeJs.forEach((name) => {
  js.push({
    from: path.resolve(`${name}.js`),
    to: `${path.resolve('dist')}/${name}.js`
  })
})
module.exports = {
  pages,
  filenameHashing: false,
  configureWebpack: {
    plugins: [CopyWebpackPlugin([{
      from: path.resolve('manifest.json'),
      to: `${path.resolve('dist')}/manifest.json`
    },{
      from: 'src/assets',
      to: `${path.resolve('dist')}/assets`
    }, ...js])]
  }
}
