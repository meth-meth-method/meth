const KEY = 'AIzaSyDd95Q0iUtdm_1bUk50JHebgNfWduojZkQ';

function loadAPI(path) {
    const url = 'https://www.googleapis.com/youtube/' + path + '&key=' + KEY;
    return fetch(url).then(r => r.json());
}

function searchChannel(channelId, maxResults = 1) {
    return loadAPI(`v3/search?channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`);
}

function listPlaylistVideos(playlistId) {
    return loadAPI(`v3/playlistItems?playlistId=${playlistId}&part=snippet,id`);
}

function loadVideo(videoId) {
    return loadAPI(`v3/videos?id=${videoId}&part=player`);
}

function populateEpisodeLists() {
    const $episodeLists = document.querySelectorAll('ul.episodes');
    [...$episodeLists].forEach(populateEpisodeList);
}

function populateEpisodeList($episodeList) {
    const type = $episodeList.dataset.type;

    if (type === 'latest') {
        loadLatestVideos($episodeList);
    }
}

function createVideoPlaceholders($episodeList, count) {
    const $contentElements = [];
    for (let i = 0; i < count; i++) {
        const $video = document.createElement('li');
        const $content = document.createElement('div');
        $content.classList.add('content');

        $video.appendChild($content);
        $episodeList.appendChild($video);

        $contentElements.push($content);
    }
    return $contentElements;
}

function injectVideo($content, item) {
    $content.style.backgroundImage = `url(${item.snippet.thumbnails.high.url})`;

    function createEmbed() {
        loadVideo(item.id.videoId)
        .then(data => {
            $content.innerHTML = data.items[0].player.embedHtml;
        });

        $content.removeEventListener('mousemove', createEmbed);
    }

    $content.addEventListener('mousemove', createEmbed);
}

function loadLatestVideos($episodeList) {
    const {channel, count} = $episodeList.dataset;
    const $elements = createVideoPlaceholders($episodeList, count);
    searchChannel(channel, count).then(injectResult($elements));
}

function injectResult($elements) {
    return function(data) {
        data.items.map((item, index) => {
            injectVideo($elements[index], item);
        });
    }
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

swivel(document.querySelector('header img'));

populateEpisodeLists();
