const { google } = require('googleapis');

const app = require('./config/custom-express')();
const puppeteer = require('puppeteer');
const resolve = require('path').resolve
let VIDEOS_TIME_STAMP
let INSTAGRAM_TIME_STAMP

app.listen(9000, async () => {
    console.log('Servidor rodando na porta 9000.');
})

app.get('/videos', async function (request, response) {
    const videos = await getLastYoutubeVideos()
    response.status(200).send(videos)
})

app.get('/instagram', async function (request, response) {
    const lastPost = await getLastInstagramPost()
    response.status(200).sendFile(lastPost)
})

async function getLastYoutubeVideos() {
    const globalPlaylist = 'UUx2tsANnhacjiqisNmPnl-Q'
    let playlistItemsResponse = await google.youtube('v3').playlistItems.list({
        part: 'snippet',
        auth: 'AIzaSyDxqhaGYUwUg2LSBPQXYNgzMmjK2sK2JXc',
        playlistId: globalPlaylist
    })

    playlistItemsResponse = playlistItemsResponse.data.items.map((item, index) => {
        let video = {
            isLastVideo: index === 0,
            title: item.snippet.title,
            url: 'https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId,
            thumb: item.snippet.thumbnails.high.url
        }
        return video;
    });

    return playlistItemsResponse
}

async function getLastInstagramPost() {
    const imageName = 'lastpost.png'
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/spoktc/');
    await page.click('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1)')
    await page.waitFor(2000)
    await page.screenshot({ 'path': imageName, 'clip': { 'x': 40, 'y': 520, 'width': 380, 'height': 380 } });
    await page.close()
    return resolve(imageName)
}
