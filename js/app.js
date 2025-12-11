
import { redirectToSpotify, handleRedirect } from './auth.js';
import { 
    fetchUserProfile, fetchTopArtists, fetchTopTracks, 
    fetchUserPlaylists, fetchArtistTopTracks, searchSpotify } from './api.js';
import { 
    populateUI, displayTopArtists, displayTopAlbums, 
    displayPlaylists, displaySearchResults, displayRecommendations,
    initUIListeners } from './ui.js';

console.log("--- Aplicația Modernă a pornit (Refactored) ---");

initUIListeners();

async function main() 
{
    const urlToken = await handleRedirect();
    const storedToken = localStorage.getItem("spotify_token");
    const token = urlToken || storedToken;

    if (token) 
    {
    
        document.getElementById("login-section").classList.add("hidden");
        document.getElementById("content-section").classList.remove("hidden");

        const profile = await fetchUserProfile(token);
        populateUI(profile);

        const topArtistsData = await fetchTopArtists(token);
        if (topArtistsData && topArtistsData.items) 
        {
            displayTopArtists(topArtistsData.items);
        }

        const topTracksData = await fetchTopTracks(token);
        if (topTracksData && topTracksData.items) 
        {
            const uniqueAlbums = getUniqueAlbums(topTracksData.items);
            displayTopAlbums(uniqueAlbums);
        }

        
        const playlistsData = await fetchUserPlaylists(token);
        if (playlistsData && playlistsData.items) 
        {
            displayPlaylists(playlistsData.items);
        }

        
        setupSearch(token);

        setupRecommendations(token, topArtistsData);

        
        document.getElementById("logout-btn").addEventListener("click", () => 
        {
            localStorage.removeItem("spotify_token");
            localStorage.removeItem("code_verifier");
            window.location.href = "index.html";
        });

    } 
    else 
    {
        const loginBtn = document.getElementById("login-btn");
        if (loginBtn) 
        {
            loginBtn.addEventListener("click", redirectToSpotify);
        }
    }
}



function getUniqueAlbums(tracks) 
{
    const uniqueAlbums = [];
    const seenAlbumIds = new Set();

    for (const track of tracks) 
    {
        const album = track.album;
        if (!seenAlbumIds.has(album.id)) 
        {
            uniqueAlbums.push({
                id: album.id,
                name: album.name,
                image: album.images[0] ? album.images[0].url : null,
                artist: album.artists[0].name,
                url: album.external_urls.spotify
            });
            seenAlbumIds.add(album.id);
        }
        if (uniqueAlbums.length === 5) break; 
    }
    return uniqueAlbums;
}

function setupSearch(token) 
{
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");

    searchBtn.addEventListener("click", async () => 
    {
        const query = searchInput.value;
        if (!query || query.trim() === "") 
        {
            alert("Scrie ceva!");
            return;
        }
        const results = await searchSpotify(token, query);
        displaySearchResults(results);
    });
}

function setupRecommendations(token, topArtistsData) 
{
    const recommendBtn = document.getElementById("recommend-btn");
    recommendBtn.addEventListener("click", async () => 
    {
        const container = document.getElementById("recommendations-container");
        container.innerHTML = "<p style='color:#888'>💿 Generăm un mix...</p>";
        
        if (!topArtistsData || !topArtistsData.items || topArtistsData.items.length === 0) 
        {
            container.innerHTML = "<p>Nu ai destui artiști.</p>";
            return;
        }

        const myArtists = topArtistsData.items.slice(0, 5);
        const mixTracks = [];

        for (const artist of myArtists) 
        {
            const topTracksData = await fetchArtistTopTracks(token, artist.id);
            if (topTracksData && topTracksData.tracks) 
            {
                mixTracks.push(...topTracksData.tracks.slice(0, 2));
            }
        }

        mixTracks.sort(() => Math.random() - 0.5);
        
        if (mixTracks.length > 0) 
        {
            displayRecommendations(mixTracks);
        } 
        else 
        {
            container.innerHTML = "<p>Eroare la generare.</p>";
        }
    });
}

main();