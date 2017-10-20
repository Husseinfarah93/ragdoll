module.exports = {
  entry: __dirname + '/src/client/js/index.js',
  output: {
    path: __dirname + '/src/client/js',
    filename: 'bundle.js'
  },
  module: {
      loaders: [
        {
          test: /.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            plugins: ['transform-decorators-legacy' ],
            presets: ['es2015', 'stage-0', 'react']
          },
        },
      {
        test: /\.scss$/,
        exclude: /chrome/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png)$/,
        loader: 'url-loader',
      }
  ]
  }
}
