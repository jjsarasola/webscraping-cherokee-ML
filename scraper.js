const puppeteer = require('puppeteer');

const URL = 'https://autos.mercadolibre.com.ar/jeep/cherokee/'

buscarCherokees(URL)


async function buscarCherokees(url) {
    //Abrimos el browser con la URL que pasamos
    const browser = await puppeteer.launch({headless: false}); //Podemos ocultar el navegador si cambiamos headless a true.
    const page = await browser.newPage();
    await page.goto(url);

 /*    //Buscamos 'jeep cherokee' en el input de búsqueda de ML
    const [inputBuscador] = await page.$x(`/html/body/header/div/form/input`);
    await inputBuscador.type('jeep cherokee');
    await page.click('.nav-search-btn')
    await page.waitForSelector('.ui-search-pagination li a') */

    //Guardamos los links de las páginas de resultados que hay en esa URL, sin contar el link del botón "Siguiente".
    let Paginas = await page.evaluate( () => {
        const cantPaginas = document.querySelectorAll('.ui-search-pagination li a')
        const LinksPaginas = []

            for (let pagina of cantPaginas) {
                LinksPaginas.push(pagina.href)
            }
            LinksPaginas.pop() //Sacamos el link del botón "Siguiente" del array.

        return LinksPaginas
    })

     //Por cada link de páginas de resutados, tomamos las URLs de cada publicación.
    let urlCherokees = []
    for (let pagina of Paginas) {
        await page.goto(pagina)
        await page.waitFor(3000)
        urlCherokees.push(
            await page.evaluate( () => {
                const elementos = document.querySelectorAll('.ui-search-result__image a')
                const links = []
                for (let elemento of elementos) {
                    links.push(elemento.href)
                }
                return links
            })
        )
    }

    urlCherokees = [].concat(...urlCherokees) //Convertimos el array multidimensional en uno unidimensional.


    //Ingresamos a cada publicacion, obtenemos los datos y devolvemos un array de objetos con lo que nos interesa.
    let cherokees = []
    for (let url of urlCherokees) {
        await page.goto(url)
        await page.waitFor(1000)
        cherokees.push(
            await page.evaluate( () => {
                const link = document.URL
                const ubicacion = document.querySelector('#root-app div div.layout-main.u-clearfix div.layout-col.layout-col--right div.layout-description-wrapper section.ui-view-more.vip-section-seller-info div.location-info span').innerText
                const titulo = document.querySelector('.item-title__primary').innerText
                const fecha = document.querySelector('.item-published-date dl dd').innerText
                const moneda = document.querySelector('#short-desc div fieldset span span.price-tag-symbol').innerText
                const precio = document.querySelector('#short-desc div fieldset span span.price-tag-fraction').innerText
                const año = document.querySelector('#short-desc div article:nth-child(1) dl dd:nth-child(2)').innerText
                const kms = document.querySelector('#short-desc div article:nth-child(1) dl dd:nth-child(4)').innerText
                let descripcion
                if (document.querySelector('#description-includes div p')) {
                    descripcion = document.querySelector('#description-includes div p').innerText
                } else {
                    descripcion = document.querySelector('#root-app div div.layout-main.u-clearfix div.layout-col.layout-col--left section.main-section.item-description div p').innerText
                }

                return {
                    Link: link,
                    Titulo: titulo,
                    Ubicacion: ubicacion,
                    FechaPublicacion: fecha,
                    Precio: moneda + ' ' + precio,
                    Modelo: año,
                    Kilometros: kms,
                    Descripcion: descripcion
                }
            })
        )
    }

    console.log(cherokees.length)
    console.log(cherokees)

    browser.close();
}