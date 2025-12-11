import { fetchAlbumTracks, fetchPlaylistTracks } from './api.js';

export function openInSpotify(url) 
{
    if (url) 
    {
        window.open(url, '_blank');
    } 
    else 
    {
        alert("Link-ul către Spotify nu este disponibil.");
    }
}

export function populateUI(profile) 
{
    const header = document.getElementById("profile-data");
    let imageUrl;

    if (profile.images && profile.images.length > 0) 
    {
        imageUrl = profile.images[0].url;
    } 
    else 
    {
        imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=1db954&color=fff&rounded=true&bold=true`;
    }
    
    header.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px;">
            <img src="${imageUrl}" alt="Avatar" style="width: 60px; height: 60px; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
            <div style="text-align: left;">
                <h2 style="margin: 0; font-size: 1.2rem;">Salut, ${profile.display_name}!</h2>
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.7; color: #b3b3b3;">${profile.email}</p>
            </div>
        </div>
    `;
}


export function displayTopArtists(artists) 
{
    const container = document.getElementById("top-artists-container");
    if (!container) return;
    container.innerHTML = ""; 

    if (artists.length === 0) 
    {
        container.innerHTML = "<p>Nu au fost găsiți artiști.</p>";
        return;
    }

    artists.forEach(artist => 
    {
        const image = artist.images[0] ? artist.images[0].url : "https://placehold.co/150";
        const card = document.createElement("div");
        card.style.cssText = "background: #181818; padding: 15px; border-radius: 8px; width: 140px; text-align: center; transition: background 0.3s; cursor: pointer;";
        
        card.innerHTML = `
            <img src="${image}" alt="${artist.name}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
            <h3 style="font-size: 14px; margin: 0; color: white; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${artist.name}</h3>
            <p style="font-size: 11px; color: #1db954; margin-top: 5px;">Vezi Profil ↗</p>
        `;

        card.onclick = () => openInSpotify(artist.external_urls.spotify);
        container.appendChild(card);
    });
}

export function displayTopAlbums(albums) 
{
    const container = document.getElementById("top-albums-container");
    if (!container) return;
    container.innerHTML = ""; 

    albums.forEach(album => 
    {
        const image = album.image || "https://placehold.co/150";
        const card = document.createElement("div");
        card.style.cssText = "background: #181818; padding: 15px; border-radius: 8px; width: 140px; text-align: center; transition: background 0.3s; cursor: pointer; position: relative;";
        
        card.innerHTML = `
            <div style="position: relative;">
                <img src="${image}" alt="${album.name}" style="width: 120px; height: 120px; border-radius: 4px; object-fit: cover; margin-bottom: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                <div class="quick-play-btn" style="position: absolute; bottom: 15px; right: 5px; background-color: #1db954; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                    <span style="color: white; font-size: 18px; margin-left: 3px;">▶</span>
                </div>
            </div>
            <h3 style="font-size: 14px; margin: 0; color: white; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${album.name}</h3>
            <p style="font-size: 12px; margin: 5px 0 0 0; color: #b3b3b3;">${album.artist}</p>
        `;

        card.addEventListener("click", () => openAlbumModal(album.id, album.name));
        
        const playBtn = card.querySelector(".quick-play-btn");
        playBtn.addEventListener("click", (e) => 
        {
            e.stopPropagation();
            openInSpotify(album.url);
        });

        container.appendChild(card);
    });
}


export function displayPlaylists(playlists) 
{
    const container = document.getElementById("playlists-container");
    if (!container) return;
    container.innerHTML = "";

    playlists.forEach(playlist => 
    {
        const image = (playlist.images && playlist.images.length > 0) ? playlist.images[0].url : "https://placehold.co/150";
        const card = document.createElement("div");
        card.style.cssText = "background: #181818; padding: 15px; border-radius: 8px; width: 140px; text-align: center; transition: background 0.3s; cursor: pointer; position: relative;";
        
        card.innerHTML = `
            <div style="position: relative;">
                <img src="${image}" style="width: 120px; height: 120px; border-radius: 4px; object-fit: cover; margin-bottom: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                <div class="quick-play-btn" style="position: absolute; bottom: 15px; right: 5px; background-color: #1db954; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                    <span style="color: white; font-size: 18px; margin-left: 3px;">▶</span>
                </div>
            </div>
            <h3 style="font-size: 14px; margin: 0; color: white; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${playlist.name}</h3>
            <p style="font-size: 12px; margin: 5px 0 0 0; color: #b3b3b3;">${playlist.tracks.total} piese</p>
        `;

        card.addEventListener("click", () => openPlaylistModal(playlist.id, playlist.name));
        
        const playBtn = card.querySelector(".quick-play-btn");
        playBtn.addEventListener("click", (e) => 
        {
            e.stopPropagation();
            openInSpotify(playlist.external_urls.spotify);
        });

        container.appendChild(card);
    });
}


export function displaySearchResults(data, containerId = "search-results") 
{
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ""; 

    const tracks = data.tracks?.items || data;
    const artists = data.artists?.items || [];

    artists.forEach(artist => 
    {
        const image = artist.images[0] ? artist.images[0].url : "https://placehold.co/150";
        const card = document.createElement("div");
        card.style.cssText = "background: #222; padding: 15px; border-radius: 8px; width: 140px; text-align: center; border: 1px solid #333; margin-bottom: 20px; cursor: pointer;";
        card.innerHTML = `
            <img src="${image}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">
            <h3 style="font-size: 14px; margin: 0; color: white;">${artist.name}</h3>
            <p style="font-size: 12px; color: #1db954;">Artist</p>
        `;
        card.onclick = () => openInSpotify(artist.external_urls.spotify);
        container.appendChild(card);
    });

    const trackList = Array.isArray(tracks) ? tracks : (tracks.items || []);

    trackList.forEach(track => 
    {
        const image = track.album.images[0] ? track.album.images[0].url : "https://placehold.co/150";
        const card = document.createElement("div");
        card.style.cssText = "background: #222; padding: 15px; border-radius: 8px; width: 140px; text-align: center; border: 1px solid #333; cursor: pointer; transition: 0.2s; margin-bottom: 20px;";
        
        card.innerHTML = `
            <img src="${image}" style="width: 100px; height: 100px; border-radius: 4px; object-fit: cover; margin-bottom: 10px;">
            <h3 style="font-size: 14px; margin: 0; color: white; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${track.name}</h3>
            <p style="font-size: 12px; color: #aaa; margin: 5px 0;">${track.artists[0].name}</p>
            <p style="font-size: 12px; color: #1db954; margin-top: 10px;">Ascultă pe Spotify ↗</p> 
        `;
        card.onclick = () => openInSpotify(track.external_urls.spotify);
        container.appendChild(card);
    });

    if (container.innerHTML === "") 
    {
        container.innerHTML = "<p>Nu am găsit rezultate.</p>";
    }
}

export function displayRecommendations(tracks) 
{
    displaySearchResults(tracks, "recommendations-container");
}



async function openAlbumModal(albumId, albumName) 
{
    const modal = document.getElementById("tracks-modal");
    document.getElementById("modal-album-name").textContent = albumName;
    const list = document.getElementById("modal-tracks-list");
    
    list.innerHTML = "<li style='padding:10px; color:#888'>Se încarcă...</li>";
    modal.classList.remove("hidden");

    const token = localStorage.getItem("spotify_token");
    const data = await fetchAlbumTracks(token, albumId);

    populateTrackList(list, data.items);
}

async function openPlaylistModal(playlistId, playlistName) 
{
    const modal = document.getElementById("tracks-modal");
    document.getElementById("modal-album-name").textContent = playlistName;
    const list = document.getElementById("modal-tracks-list");

    list.innerHTML = "<li style='padding:10px; color:#888'>Se încarcă...</li>";
    modal.classList.remove("hidden");

    const token = localStorage.getItem("spotify_token");
    const data = await fetchPlaylistTracks(token, playlistId);
    
    const tracks = data.items.map(item => item.track).filter(t => t !== null);
    populateTrackList(list, tracks);
}


function populateTrackList(listContainer, tracks) 
{
    listContainer.innerHTML = "";
    if (!tracks || tracks.length === 0) 
    {
        listContainer.innerHTML = "<li style='padding:10px'>Nicio piesă găsită.</li>";
        return;
    }

    tracks.forEach((track, index) => 
    {
        const minutes = Math.floor(track.duration_ms / 60000);
        const seconds = ((track.duration_ms % 60000) / 1000).toFixed(0);
        const duration = minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

        const li = document.createElement("li");
        li.innerHTML = `
            <div style="display:flex; align-items:center; width:100%;">
                <span style="width: 30px; color:#888;">${index + 1}.</span>
                <span style="flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 10px;">${track.name}</span>
                <span style="color: #bbb; font-size: 0.9em; margin-right: 15px;">${duration}</span>
                <button class="play-btn-small" style="background:none; border:none; cursor:pointer; color:#1db954; font-size: 1.2em;">▶</button>
            </div>
        `;
        
        const btn = li.querySelector(".play-btn-small");
        btn.onclick = () => openInSpotify(track.external_urls.spotify);
        listContainer.appendChild(li);
    });
}


export function initUIListeners() 
{
    const closeBtn = document.getElementById("close-modal");
    if(closeBtn) 
        {
        closeBtn.addEventListener("click", () => 
        {
            document.getElementById("tracks-modal").classList.add("hidden");
        });
    }
    
    window.onclick = function(event) 
    {
        const modal = document.getElementById("tracks-modal");
        if (event.target == modal) 
        {
            modal.classList.add("hidden");
        }
    }
}