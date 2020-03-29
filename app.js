const { google } = require('googleapis');

const app = require('./config/custom-express')();
const puppeteer = require('puppeteer');
const resolve = require('path').resolve
let videosTimeStamp
let lastPostTimeStamp
let lastPost
let videos

app.listen(9000, async () => {
    await updateVideos()
    await updateLastPost()
    console.log('Servidor rodando na porta 9000.');
})

app.get('/videos', async function (request, response) {
    await updateVideos()
    response.status(200).send(videos)
})

app.get('/instagram', async function (request, response) {
    await updateLastPost()
    response.status(200).sendFile(lastPost)
})

async function getLastYoutubeVideos() {
    if (videosTimeStamp && diffInDays(videosTimeStamp) === 0) {
        return videos
    }

    const globalPlaylist = 'UUx2tsANnhacjiqisNmPnl-Q'
    let playlistItemsResponse = await google.youtube('v3').playlistItems.list({
        part: 'snippet',
        auth: 'AIzaSyDxqhaGYUwUg2LSBPQXYNgzMmjK2sK2JXc',
        playlistId: globalPlaylist
    })

    playlistItemsResponse = playlistItemsResponse.data.items.map((item, index) => {
        console.log(item.snippet.thumbnails)
        let video = {
            isLastVideo: index === 0,
            title: item.snippet.title,
            url: 'https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId,
            id: item.snippet.resourceId.videoId,
            thumb: item.snippet.thumbnails.maxres.url
        }
        return video;
    });
    videosTimeStamp = new Date()
    console.log(playlistItemsResponse)
    return playlistItemsResponse
}

async function getLastInstagramPost() {
    if (lastPostTimeStamp && diffInDays(lastPostTimeStamp) === 0) {
        return lastPost
    }

    const imageName = 'lastpost.png'
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/spoktc/');
    await page.click('#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1)')
    await page.waitFor(2000)
    await page.screenshot({ 'path': imageName, 'clip': { 'x': 40, 'y': 520, 'width': 375, 'height': 375 } });
    browser.close();
    lastPostTimeStamp = new Date()
    console.log(resolve(imageName))
    return resolve(imageName)

}

async function updateVideos() {
    videos = await getLastYoutubeVideos()
}

async function updateLastPost() {
    lastPost = await getLastInstagramPost()
}

function diffInDays(dt2) {
    const dt1 = new Date()
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
}
