const KEY = 'AIzaSyDd95Q0iUtdm_1bUk50JHebgNfWduojZkQ';

function loadAPI(path) {
    const url = 'https://www.googleapis.com/youtube/' + path + '&key=' + KEY;
    return fetch(url).then(r => r.json());
}

function searchChannel(channelId, maxResults = 1) {
    return loadAPI(`v3/search?channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`);
}

function loadVideo(videoId) {
    return loadAPI(`v3/videos?id=${videoId}&part=player`);
}

searchChannel('UC8A0M0eDttdB11MHxX58vXQ', 8)
.then(data => {
    data.items.map(item => {
        const $video = document.createElement('li');
        const $content = document.createElement('div');
        $content.classList.add('content');
        $content.style.backgroundImage = `url(${item.snippet.thumbnails.high.url})`;

        $video.appendChild($content);
        $episodeList.appendChild($video);

        function createEmbed() {
            loadVideo(item.id.videoId)
            .then(data => {
                $content.innerHTML = data.items[0].player.embedHtml;
            });

            $content.removeEventListener('mousemove', createEmbed);
        }

        $content.addEventListener('mousemove', createEmbed);
    });
});

const $latestEpisodes = document.querySelector('#latest-episodes');
const $episodeList = $latestEpisodes.querySelector('.episodes');

function swivel(element) {

    function update(time) {
        const ex = 10;
        const x = Math.sin(time / 1231) * ex;
        const y = Math.sin(time / 1458) * ex;

        element.style.transform = [
            `rotateX(${x}deg)`,
            `rotateY(${y}deg)`
        ].join(' ');

        requestAnimationFrame(update);
    }

    update(0);
}

swivel(document.querySelector('header > img'));
