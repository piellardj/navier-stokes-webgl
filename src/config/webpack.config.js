const path = require("path");

const PROJECT_DIR = path.resolve(__dirname, "..", "..");

module.exports = {
    devtool: "none",
    entry: path.join(PROJECT_DIR, "src", "ts", "main.ts"),
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            //   transpileOnly: true,
                            compilerOptions: {
                                rootDir: path.join(PROJECT_DIR, "src", "ts")
                            },
                            configFile: path.join(PROJECT_DIR, "src", "config", 'tsconfig.json')
                        }
                    }
                ],
            }
        ]
    }
}
