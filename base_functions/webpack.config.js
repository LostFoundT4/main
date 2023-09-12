const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '...'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
        }
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
    }
    ],
  },
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "bundle.js",
  }
};