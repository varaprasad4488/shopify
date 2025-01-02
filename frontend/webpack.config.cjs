// webpack.config.cjs

const path = require('path');

module.exports = {
  entry: './src/Sample.jsx',
  output: {
    filename: 'sample.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, 
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]' 
        }
      }
    ]
  },
  mode: 'development' 
};
