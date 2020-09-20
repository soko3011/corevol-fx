"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let secondaryWindows;
let childWindowInt = 1;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    mainWindow.loadURL("app://./index.html");
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
    apiProcess.kill();
  });
}

// Quit when all mainWindowdows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    apiProcess.kill();
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other mainWindowdows open.
  if (mainWindow === null) {
    startApi();
    //createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  startApi();
  //createWindow();
});

ipcMain.on("new-window", () => {
  secondaryWindows = new BrowserWindow({
    width: 1000,
    height: 700,
    title: "",
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    secondaryWindows.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    secondaryWindows.loadURL("app://./index.html");
  }

  secondaryWindows.on("closed", () => {
    secondaryWindows = null;
  });

  secondaryWindows.webContents.on("did-finish-load", () => {
    secondaryWindows.setTitle(`COREVOLFX-${childWindowInt}`);
    childWindowInt++;
  });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        apiProcess.kill();
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      apiProcess.kill();
      app.quit();
    });
  }
}

const os = require("os");
const path = require("path");

var apiProcess = null;

function startApi() {
  var proc = require("child_process").spawn;
  //  run server
  //var apipath = path.join(__dirname, '..\\api\\bin\\dist\\mainWindow\\api.exe')
  var apipath = "";
  if (os.platform() === "darwin") {
    apipath = path.join(
      __dirname,
      "../src/extraResources/dist/osx/FxVolEngineWebApiProd"
    );
  }

  apiProcess = proc(apipath);

  apiProcess.stdout.on("data", data => {
    writeLog(`stdout: ${data}`);
    if (mainWindow == null) {
      createWindow();
    }
  });
}

//Kill process when electron exits
process.on("exit", function() {
  writeLog("exit");
  apiProcess.kill();
});

function writeLog(msg) {
  console.log(msg);
}
