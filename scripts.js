document.addEventListener('DOMContentLoaded', function() {
    const channelIds = [
        'UC8R84d88YJDXLHRwnTrbNbw',  // Polski
        'UCZbU79MK6RxCKSQWfjIj1oQ',  // Turecko/Angielski
        'UC2aryP954fHFb9vld3Hk3OA',  // Angielski
        'UCKRvfdO9-HaR9ix4a-0LrOw'   // Angielski
    ];

    const videoColumns = [
        document.getElementById('video-list-1'),
        document.getElementById('video-list-2'),
        document.getElementById('video-list-3'),
        document.getElementById('video-list-4')
    ];

    function fetchVideosFromRSS(channelId, index) {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

        fetch(rssUrl)
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(data => {
                const items = data.querySelectorAll("entry");
                items.forEach(item => {
                    const videoElement = document.createElement('div');
                    videoElement.classList.add('video');
                    videoElement.innerHTML = `
                        <a href="${item.querySelector('link').getAttribute('href')}" target="_blank">
                            <img src="https://img.youtube.com/vi/${item.querySelector('yt\\:videoId').textContent}/mqdefault.jpg" alt="${item.querySelector('title').textContent}">
                        </a>
                        <h3>${item.querySelector('title').textContent}</h3>
                    `;
                    videoColumns[index].appendChild(videoElement);
                });
            })
            .catch(error => console.error('Error fetching video data:', error));
    }

    channelIds.forEach((channelId, index) => {
        fetchVideosFromRSS(channelId, index);
    });
});

function filterVideos() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const videos = document.querySelectorAll('.video');
    videos.forEach(video => {
        const title = video.querySelector('h3').innerText.toLowerCase();
        if (title.includes(searchTerm)) {
            video.style.display = '';
        } else {
            video.style.display = 'none';
        }
    });
}
