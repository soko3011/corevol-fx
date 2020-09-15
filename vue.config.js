module.exports = {
  publicPath: "/corevol-fx",
  outputDir: "docs",
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "CoreVol-FX",
        icon: "/Users/wimpole/vuetify-ui/src/assets/icon.icns",
        mac: {
          category: "finance",
        },
      },
    },
  },
};
