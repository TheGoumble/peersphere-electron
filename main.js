const { app, BrowserWindow, session } = require('electron')
const CONFIG = require('./config.js')

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

  // Set CSP dynamically using the backend URL from config
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' ${CONFIG.API_BASE_URL}`
        ]
      }
    })
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})