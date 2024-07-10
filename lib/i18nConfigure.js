// cargar la librería
const i18n = require('i18n');
const path = require('node:path');

// configurar mi instancia de i18n
i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'en',
  autoReload: true, // Watch for changes in json files to reload locale on updates
  syncFiles: true, // Sync locale information across all files
  cookie: 'nodeapp-locale',
})

// para utilizar en script
i18n.setLocale('en');

// exportamos la instancia de i18n
module.exports = i18n