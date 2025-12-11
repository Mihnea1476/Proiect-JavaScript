export async function fetchUserProfile(token) 
{
    const result = await fetch("https://api.spotify.com/v1/me", 
    {
        method: "GET", 
        headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export async function fetchTopArtists(token) 
{
    const endpoint = new URL("https://api.spotify.com/v1/me/top/artists");
    
    endpoint.searchParams.append("time_range", "long_term"); 
    endpoint.searchParams.append("limit", "5");

    const result = await fetch(endpoint.toString(), 
    {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export async function fetchTopTracks(token) 
{
    const endpoint = new URL("https://api.spotify.com/v1/me/top/tracks");
    
    endpoint.searchParams.append("time_range", "long_term");
    endpoint.searchParams.append("limit", "50"); 

    const result = await fetch(endpoint.toString(), 
    {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export async function fetchAlbumTracks(token, albumId) 
{
    const endpoint = `https://api.spotify.com/v1/albums/${albumId}/tracks`;
    
    const result = await fetch(endpoint, 
    {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}


export async function searchSpotify(token, query) 
{
    const endpoint = new URL("https://api.spotify.com/v1/search"); 
    
    endpoint.searchParams.append("q", query);
    endpoint.searchParams.append("type", "track,artist");
    endpoint.searchParams.append("limit", "10");

    const result = await fetch(endpoint.toString(), 
    {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}


export async function fetchUserPlaylists(token) 
{
    const endpoint = new URL("https://api.spotify.com/v1/me/playlists");
    
    endpoint.searchParams.append("limit", "10");

    const result = await fetch(endpoint.toString(), 
    {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export async function fetchPlaylistTracks(token, playlistId) 
{
    const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    
    const result = await fetch(endpoint, 
    {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}


export async function fetchArtistTopTracks(token, artistId) 
{
    const endpoint = `https://api.spotify.com/v1/artists/${artistId}/top-tracks`;

    const result = await fetch(endpoint, 
    {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}