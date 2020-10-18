// vue.config.js
module.exports = {
    devServer: {
        proxy: {
          '^/api': {
            target: 'http://192.168.1.119:4000/v1',
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/', // rewrite path
              },
          },

        }
      }
}