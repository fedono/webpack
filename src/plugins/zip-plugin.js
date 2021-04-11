/*
* 写一个压缩文件的plugin
* 在 webpack 中的使用方式为 new ZipPlugin({name: 'offline'}) // 这里的 name: offline 是设置打包之后的文件名
* */

const JSZip = require('jszip');
const path = require('path');
const RawSource = require('webpack-source');
const zip = new JSZip();

module.exports = class ZipPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
            // 创建需要压缩后的文件名
            const folder = zip.folder(this.options.filename);

            // 将所有需要有所的文件加入到这个文件夹里去
            for (let filename in compilation.assets) {
                // 文件的内容
                let source = compilation.assets[filename].source()
                folder.file(filename, source);
            }

            // 开始压缩
            zip.generateAsync({
                type: 'nodebuffer' // 打包的类型
            }).then((content) => {
                // content 是一个 buffer 对象
                // compilation.options 这个可以输出所有的配置类型信息，以及输出的信息等

                // 这个是绝对路径
                const outputPath = path.join(
                    compilation.options.output.path,
                    this.options.filename + '.zip'
                );

                // 生成相对当前目录的路径
                const outputRelativePath = path.relative(
                    compilation.options.output.path,
                    outputPath
                );
                // RawSource 用来转换内容
                compilation.assets[outputRelativePath] = new RawSource(content);

                // 最后一定要执行 callback 函数
                callback();
            })
        })
    }
}
