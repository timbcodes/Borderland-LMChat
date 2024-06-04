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
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ["sqlite3"],
      outputDir: "dist_electron",
      nodeModulesPath: ["./node_modules"],
      builderOptions: {
        extraResources: [
          {
            from: "node_modules/sqlite3/lib/binding",
            to: "node_modules/sqlite3/lib/binding",
            filter: ["**/*"],
          },
        ],
      },
    },
  },
});
