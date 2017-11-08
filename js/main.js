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

function loadLatestVideos(count = 8) {
    const $latestEpisodes = document.querySelector('#latest-episodes');
    const $episodeList = $latestEpisodes.querySelector('.episodes');

    const $contentElements = [];
    for (let i = 0; i < count; i++) {
        const $video = document.createElement('li');
        const $content = document.createElement('div');
        $content.classList.add('content');

        $video.appendChild($content);
        $episodeList.appendChild($video);

        $contentElements.push($content);
    }

    searchChannel('UC8A0M0eDttdB11MHxX58vXQ', count)
    .then(data => {
        data.items.map((item, index) => {
            const $content = $contentElements[index];
            $content.style.backgroundImage = `url(${item.snippet.thumbnails.high.url})`;

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
}

function swivel(element) {

    function update(time) {
        const speedMultiplier = 0.2;
        const motionAmplifier = 10;
        const x = Math.sin(time / 1231 * speedMultiplier) * motionAmplifier;
        const y = Math.sin(time / 1458 * speedMultiplier) * motionAmplifier;

        element.style.transform = [
            `rotateX(${x}deg)`,
            `rotateY(${y}deg)`
        ].join(' ');

        requestAnimationFrame(update);
    }

    update(0);
}

swivel(document.querySelector('header > img'));
loadLatestVideos();
