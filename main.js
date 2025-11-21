const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // Allow localhost connections
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})