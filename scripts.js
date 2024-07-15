document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'AIzaSyBLRzMMAv3iAZWUe4y346bmDOSyYymRR3Y';
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

    channelIds.forEach((channelId, index) => {
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=150&key=${apiKey}&type=video`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                data.items.forEach(video => {
                    const videoElement = document.createElement('div');
                    videoElement.innerHTML = `
                        <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                            <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                        </a>
                        <h3>${video.snippet.title}</h3>
                    `;
                    videoColumns[index].appendChild(videoElement);
                });
            })
            .catch(error => console.error('Error fetching video data:', error));
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

