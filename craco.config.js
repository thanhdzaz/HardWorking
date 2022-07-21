const { when, whenDev, whenProd, whenCI, whenTest, ESLINT_MODES, POSTCSS_MODES } = require('@craco/craco');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CracoAntDesignPlugin = require('craco-antd');
const path = require("path");

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#1DA57A',
          '@link-color': '#1DA57A',
        },
      },
    },
  ],
  webpack: {
    alias: {
      'components': path.resolve(__dirname, "src/components/"),
      'images': path.resolve(__dirname, "src/images/"),
      'lib': path.resolve(__dirname, "src/lib/"),
      'models': path.resolve(__dirname, "src/models/"),
      'scenes': path.resolve(__dirname, "src/scenes/"),
      'services': path.resolve(__dirname, "src/services/"),
      'stores': path.resolve(__dirname, "src/stores/"),
      'utils': path.resolve(__dirname, "src/utils/"),
      'constant': path.resolve(__dirname, "src/constant/"),
    },
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      if (!webpackConfig.plugins) {
        config.plugins = [];
      }

      webpackConfig.plugins.push(
        process.env.NODE_ENV === 'production'
          ? new CopyWebpackPlugin([
              {
                from: 'node_modules/@aspnet/signalr/dist/browser/signalr.min.js',
              },
              {
                from: 'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
              },
              {
                from: 'src/lib/abp.js',
              },
              {
                from: 'web.config',
              },
            ])
          : new CopyWebpackPlugin([
              {
                from: 'node_modules/@aspnet/signalr/dist/browser/signalr.min.js',
              },
              {
                from: 'node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr-client.js',
                to:'dist/abp.signalr-client.js'
              },
              {
                from: 'src/lib/abp.js',
              },
            ])
      );

       const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.find(
         (plugin) => plugin.options && plugin.options.ignoreOrder != null,
       );

       if (instanceOfMiniCssExtractPlugin)
         instanceOfMiniCssExtractPlugin.options.ignoreOrder = true;
      
      return webpackConfig;
    },
  },
};
