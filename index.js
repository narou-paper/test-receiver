const express = require('express')
const fs = require('fs')
const puppeteer = require('puppeteer');
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/', (req, res) => {
    const { bodyHtml, ...resBody } = req.body
    console.log(bodyHtml.slice(0, 100));

    (async () => {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setJavaScriptEnabled(true)
        await page.setViewport({
            width: 528,
            height: 880,
            deviceScaleFactor: 1,
        })
        await page.goto(`file://${__dirname}/template.html`)
        await page.pdf({path: 'episode.pdf', width: 528, height: 880});

        await browser.close()
    })();

    try {
        fs.writeFileSync('episode.json', JSON.stringify(resBody, null, '    '))
    } catch (e) {
        throw Error(`file writing failed: ${e}`)
    }
    res.status(200).send('succeeded')
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Narou Paper Receiver listening at http://0.0.0.0:${port}`)
})
