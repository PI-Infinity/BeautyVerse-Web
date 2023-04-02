const path = require('path');

module.exports = {
  // The entry point of your application
  entry: './src/index.js',

  // The output configuration for bundled files
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // Define the rules for processing different types of files
  module: {
    rules: [
      // Example rule for processing JavaScript files with Babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // Example rule for processing CSS files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Add rule to disable source maps for timeago.js package
      {
        test: /\.js$/,
        enforce: 'pre',
        include: /node_modules\/timeago\.js/,
        loader: 'source-map-loader',
        options: {
          filterSourceMappingUrl: (url, resourcePath) => false,
        },
      },
      // Add other rules for various file types as needed
    ],
  },


