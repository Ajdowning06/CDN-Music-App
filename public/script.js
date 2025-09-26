const songListElement = document.getElementById('song-list');
const audioPlayer = document.getElementById('audio-player');
const songTitleElement = document.getElementById('song-title');

const fetchSongs = async () => {
    try {
        const response = await fetch('/songs');
        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }
        const songs = await response.json();
        renderSongs(songs);
    } catch (error) {
        console.error('Error:', error);
        songListElement.innerHTML = '<li class="text-center text-red-400">Failed to load songs. Make sure the server is running.</li>';
    }
};

const renderSongs = (songs) => {
    songListElement.innerHTML = '';
    if (songs.length === 0) {
        songListElement.innerHTML = '<li class="text-center text-gray-400">No songs found. Add files to the `music` directory.</li>';
        return;
    }

    songs.forEach(song => {
        const listItem = document.createElement('li');
        listItem.className = 'music-list-item p-3 rounded-lg flex items-center justify-between transition-all duration-200 bg-gray-800 border border-transparent hover:border-indigo-500';
        listItem.innerHTML = `
            <span class="truncate">${song}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-indigo-400 ml-2 flex-shrink-0">
                <path fill-rule="evenodd" d="M4.5 5.653c0-1.23.955-2.23 2.13-2.23c.319 0 .633.072.923.21l10.966 5.378a2.25 2.25 0 0 1 0 4.026l-10.966 5.378c-.29.138-.604.21-.923.21c-1.175 0-2.13-.999-2.13-2.23V5.653Z" clip-rule="evenodd" />
            </svg>
        `;
        listItem.addEventListener('click', () => {
            const songUrl = `/music/${encodeURIComponent(song)}`;
            audioPlayer.src = songUrl;
            songTitleElement.textContent = song;
        });
        songListElement.appendChild(listItem);
    });
};

// Fetch and display songs when the page loads
document.addEventListener('DOMContentLoaded', fetchSongs);
