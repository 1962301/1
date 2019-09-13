const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CLIEngine = require("eslint").CLIEngine;
const formatter = CLIEngine.getFormatter();
 module.exports = {
 		devtool:"none",//"eval-source-map",//"none",//eval-source-map",
        mode:"production",//"development",//"production",//"development",                
        entry: {
            //LoginForm:'./js components/LoginForm.js',
            //ResizableDiv:'./js components/ResizableDiv.js',
            App:"./js components/App.js"
        },
        output: {
            path: __dirname+"/component js",
            filename: '[name].bundle.js',
            //publicPath:"/....."   如果设置了，那么index.html里边引用的js就需要到这个文件夹下引用，如果没设，那么引用直接和index.html同一个文件夹
        },

        devServer:{
        	contentBase:__dirname,
        	inline:false                  //这个关了，打包就小了
        },
        optimization:{
            removeAvailableModules:true,     //remove modules from chunks when these modules are alreadt included in all parents
            removeEmptyChunks: true,
            mergeDuplicateChunks: true,     
            minimizer:[
                new UglifyJsPlugin({                 
                    uglifyOptions: {
                        parallel: true,
                        ie8:false,
                        compress: false,
                        ecma: 8,
                        mangle: true,
                        warnings:false,
                        compress:{              
                            drop_console:true
                        },
                        output:{
                            beautify:false,
                            comments:false
                        }
                    },           
                }),
            ]
        },
        module: {

            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/env", "@babel/react"
                            ],
                            plugins:["@babel/plugin-proposal-class-properties"]

                        }
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "style-loader"
                        }, 
                        {
                            loader: "css-loader",
                            options:{
                                modules:{
                                    mode:'local',
                                    localIdentName:"[name]__[local]--[hash:base64:5]"
                                }
                            }
                        }
                    ],
                    exclude: /node_modules/
                },
                /*
                {   
                    enforce: "pre",
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "eslint-loader",
                    
                    options: {
                        formatter:formatter
                       // "plugins": [ "react-hooks"],
                       // "rules": {
                       //     "react-hooks/rules-of-hooks": "error",
                       //     "react-hooks/exhaustive-deps": "warn"
                        //}
                    }
                    
                }
                */
                
            ]
        },
        plugins: [
            new BundleAnalyzerPlugin(
               {
                  analyzerMode: 'server',
                  analyzerHost: '127.0.0.1',
                  analyzerPort: 8889,
                  reportFilename: 'report.html',
                  defaultSizes: 'parsed',
                  openAnalyzer: true,
                  generateStatsFile: false,
                  statsFilename: 'stats.json',
                  statsOptions: null,
                  logLevel: 'info'
                }
            ),
        ]

    }