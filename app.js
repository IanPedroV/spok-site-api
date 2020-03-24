const { google } = require('googleapis');

let app = require('./config/custom-express')();

app.listen(9000, async () => {
    console.log('Servidor rodando na porta 9000.');
})

app.get('/', async function (request, response) {
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

    response.status(200).send(playlistItemsResponse);
})