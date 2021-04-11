/*
* 以下是一个最简单的 plugin 的开发，
* 这时候在 webpack 的配置中，通过 import 导入当前文件，
* 然后在 Plugins 的配置中，使用 new MyPlugin({name: 'myPlugin'})
* 这时候使用 webpack 编译的时候，就能够打印出 apply {name: 'myPlugin'} 的信息了
* 因为会默认执行 apply 的方法
* */

module.exports = class MyPlugin {
    constructor(options) {
        this.options = options;
    }

    apply() {
        console.log('apply', this.options);
    }
}
