module.exports = {
  publicPath: "/corevol-fx",
  outputDir: "docs",
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "cross-platform-desktop",
        directories: {
          buildResources: "../../assets",
          output: "../../dist"
        },
        extraResources: {
          from: "../api/bin/dist/",
          to: "api/bin/dist/",
          filter: ["**/*"]
        },
        icon: "/Users/wimpole/vuetify-ui/src/assets/icon.icns",
        mac: {
          category: "finance"
        }
      }
    }
  }
};
