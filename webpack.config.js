module.exports = {
  entry: './tmp/js/main.js',
  output: {
    filename: 'main-min.js',
    path: '/home/jeremie/Bureau/github/navier-stokes-webgl/script/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [ 'es2015', { modules: false } ]
          ]
        }
      }
    ]
  }
}
