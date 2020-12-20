# webscraping-cherokee-ML
Aplicación con Puppeteer JS para hacer web scraping en Mercado Libre y traer un listado de Jeep Cherokee's en venta con los datos de la publicación.

## Setup - Instalar modulos:
```
npm install
```

## Ejecutar:
```
node scraper.js
```

## Opciones:
En la línea 10 podemos ocultar el navegador si modificamos la propiedad headless a true.
```
const browser = await puppeteer.launch({headless: false});
```
