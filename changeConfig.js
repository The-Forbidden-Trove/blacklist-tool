const fs = require('fs')

const configText = fs.readFileSync('./config.json')
if (process.env.poe2_mode !== 'true') {
    fs.writeFileSync('./config.json', new String(configText).replace(/"POE_WINDOW_TITLE": .*/, `"POE_WINDOW_TITLE": "Path of Exile",`))
    return;
}

fs.writeFileSync('./config.json', new String(configText).replace(/"POE_WINDOW_TITLE": .*/, `"POE_WINDOW_TITLE": "Path of Exile 2",`))