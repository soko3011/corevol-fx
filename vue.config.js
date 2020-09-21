module.exports = {
  //publicPath: "/corevol-fx",
  outputDir: "docs",
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: "cross-platform-desktop",
        icon: "./src/assets/icon.icns",
        extraResources: ["./src/extraResources/dist/osx/**"],
        mac: {
          category: "finance"
        }
      }
    }
  }
};

//election build files are in here. extraresources is file path of published api files
