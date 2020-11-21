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
        await page.goto(`file://${__dirname}/template/template.html`)


        await page.evaluate(() => {
            //ここらへんリクエストとすり合わせてください
            const novelContainer = document.getElementById('novel')
            //タイトルのクラスをつければ真ん中になる
            const pElement = document.createElement('p')
            pElement.className = 'novel_subtitle'
            pElement.textContent = 'たいとるだよん'
            novelContainer.appendChild(pElement)
            //作者とかを下に持ってきたい場合はtext-alignのクラスをcssファイルに追加して

            //ただの文章は追加するだけ
            for(let i=0;i<30;i++){
                let text = 'キリトかなー'
                for(let j=0;j<i;j++)
                    text += 'w'
                text += 'やっぱwww。'

                const pElement = document.createElement('p')
                pElement.textContent = text
                novelContainer.appendChild(pElement)
            }
        })
        await page.waitForTimeout(500) //要検討.ファイルのIOが遅いとかで500ms以上ほしいときに対応できなくなってしまうので
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
