const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
      fallback: {
        fs: false,
        path: require.resolve("path-browserify"),
        __dirname: false,
      },
    },
  },
});
