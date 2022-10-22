// webpack 构建核心配置 （html js css 图片）
const path = require("path");
//NodeJsPackageMange,压缩体积，混淆代码
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 打包html的插件
const TerserWebpackPlugin = require("terser-webpack-plugin"); // 优化体积
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin"); // 优化css
const CopyWebpackPlugin = require("copy-webpack-plugin"); // 复制目录文件

module.exports = {
    mode : "production",  // 构建的模式（开发模式 development 生产模式 production）
    devtool : "inline-source-map",  // 排错定位源码处理
    entry : {    // 入口文件（打包从哪一个模块开始）
        "js/index" : "./src/js/index.js",
        "js/page/detail" : "./src/js/page/detail.js",
        "js/page/order" : "./src/js/page/order.js",
        "js/page/personal" : "./src/js/page/personal.js",
        "js/page/proList" : "./src/js/page/proList.js",
        "js/page/shopcart" : "./src/js/page/shopcart.js",
    },
    output : {               // 打包后的产品输出位置
        path: path.resolve(__dirname,"dist"),
        filename: "[name].js"
    },
    plugins : [//插件
        new HtmlWebpackPlugin({
            template : "./src/index.html",  // 需要打包的是哪一个html文件
            filename: "index.html", // 打包后在dist目录下的文件名
            chunks : ["js/index"]
        }),
        new HtmlWebpackPlugin({
            template : "./src/page/detail.html",  // 需要打包的是哪一个html文件
            filename: "page/detail.html", // 打包后在dist目录下的文件名
            chunks : ["js/page/detail"]
        }),
        new HtmlWebpackPlugin({
            template : "./src/page/order.html",  // 需要打包的是哪一个html文件
            filename: "page/order.html", // 打包后在dist目录下的文件名
            chunks : ["js/page/order"]
        }),
        new HtmlWebpackPlugin({
            template : "./src/page/personal.html",  // 需要打包的是哪一个html文件
            filename: "page/personal.html", // 打包后在dist目录下的文件名
            chunks : ["js/page/personal"]
        }),
        new HtmlWebpackPlugin({
            template : "./src/page/proList.html",  // 需要打包的是哪一个html文件
            filename: "page/proList.html", // 打包后在dist目录下的文件名
            chunks : ["js/page/proList"]
        }),
        new HtmlWebpackPlugin({
            template : "./src/page/shopcart.html",  // 需要打包的是哪一个html文件
            filename: "page/shopcart.html", // 打包后在dist目录下的文件名
            chunks : ["js/page/shopcart"]
        }),
        new CopyWebpackPlugin({
            patterns : [
                {from : "./src/static", to: "./static"} // 可以配置多个对象
            ]
        })
    ],
    module : {
        rules : [
            {
                test : /\.css$/,  // 打包以 .css 结尾的文件
                use : ['style-loader','css-loader']  //打包用到的插件
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|webp)$/i, //寻找图片文件（可以自行配置）
                exclude:/node_modules/,  //排除在 node_moudules中的文件
                use:{
                    loader:"url-loader",
                    options:{
                        limit:1024*10, //当图片小于10KB时,图片转化为base64位编码
                        outputPath:"./images/", //图片在dist中存放的位置
                        esModule:false //避免插件冲突
                    }
                },
                type:"javascript/auto"  //webpack 5需要加这个配置
            },
            {
                test:/\.(html|htm)$/i,
                use:["html-withimg-loader"]  //对html中使用到的图片进行打包处理
            }
        ]
    },
    performance : {
        hints : false
    },
    devServer:{
        port:8000, //修改端口号
        hot:true, //启动热更新
    },
    optimization : {   // 在生产环境下打包时优化css的体积
        minimize : true,
        minimizer : [
            new TerserWebpackPlugin(),
            new CssMinimizerWebpackPlugin()
        ]
    }
}