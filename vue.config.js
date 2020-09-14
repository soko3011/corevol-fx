module.exports = {
  publicPath: "/corevol-fx",
  outputDir: "docs",
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "corevol-fx",
        icon: "/Users/jamiesokolsky/vuetify-ui/src/assets/icon.icns",
        mac: {
          category: "finance",
        },
      },
    },
  },
};
