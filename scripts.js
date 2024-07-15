document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'AIzaSyAZ8cK1e60983rHcYECABvmtBIkqhvkuFY';
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

    const cacheKey = 'youtubeVideosCache';
    const cacheExpiryKey = 'youtubeVideosCacheExpiry';

    function isCacheValid() {
        const cacheExpiry = localStorage.getItem(cacheExpiryKey);
        if (!cacheExpiry) return false;

        const now = new Date();
        const expiryDate = new Date(cacheExpiry);
        return now < expiryDate;
    }

    function saveToCache(data) {
        localStorage.setItem(cacheKey, JSON.stringify(data));

        const now = new Date();
        const expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 godziny
        localStorage.setItem(cacheExpiryKey, expiryDate.toISOString());
    }

    function loadFromCache() {
        const data = localStorage.getItem(cacheKey);
        return data ? JSON.parse(data) : null;
    }

    function displayVideos(data) {
        data.forEach((channelVideos, index) => {
            channelVideos.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.classList.add('video');
                videoElement.innerHTML = `
                    <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                        <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                    </a>
                    <h3>${video.snippet.title}</h3>
                `;
                videoColumns[index].appendChild(videoElement);
            });
        });
    }

    function fetchVideos() {
        let fetchPromises = channelIds.map((channelId, index) => {
            const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&key=${apiKey}&type=video`;
            
            return fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error('YouTube API Error:', data.error);
                        return [];
                    }

                    return data.items;
                })
                .catch(error => {
                    console.error('Error fetching video data:', error);
                    return [];
                });
        });

        Promise.all(fetchPromises)
            .then(results => {
                saveToCache(results);
                displayVideos(results);
            })
            .catch(error => console.error('Error with fetch promises:', error));
    }

    if (isCacheValid()) {
        const cachedData = loadFromCache();
        displayVideos(cachedData);
    } else {
        fetchVideos();
    }
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
