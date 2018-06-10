const { app, BrowserWindow, Tray, Menu, MenuItem, ipcMain } = require('electron')
const { ICON_PATH, REACT_DEVELOPER_TOOLS_PATH, dev, loadURL, windowSizes } = require('./app-configs/utils')

let win = null
let tray = null

app.on('ready', () => {
    tray = new Tray(ICON_PATH)
    win = new BrowserWindow({
        ...windowSizes,
        icon: ICON_PATH,
        frame: false,
        resizable: dev,
    })

    // win.setSkipTaskbar(true)

    const trayContextMenu = Menu.buildFromTemplate([
        new MenuItem({
            label: 'About elo-ni',
            click() {
                console.log('about')
            },
        }),
        new MenuItem({ type: 'separator' }),
        new MenuItem({ label: 'Quit app', role: 'quit' }),
    ])

    tray.on('double-click', () => {
        win.isVisible() ? win.hide() : win.show()
    })

    tray.setContextMenu(trayContextMenu)
    tray.setToolTip('Click to hide/show')
    // tray.setHighlightMode('always')

    win.loadURL(loadURL)
    win.on('closed', () => {
        app.quit()
    })

    if (dev) {
        BrowserWindow.addDevToolsExtension(REACT_DEVELOPER_TOOLS_PATH)
        win.webContents.openDevTools({ mode: 'right' })
        win.setSize(windowSizes.width + 1000, windowSizes.height)
        win.setPosition(250, 200)
    }
})

app.on('before-quit', () => {
    win.webContents.send('before-quit')
    tray.destroy()
    tray = null
    win = null
})

ipcMain.on('quit-app', () => {
    app.quit()
})
