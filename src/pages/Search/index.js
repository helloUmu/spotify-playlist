import { useEffect, useState } from "react";
import axios from 'axios';
import List from "../../components/hw3/Track/List"



function SearchPage() {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
    const REDIRECT_URI = "http://localhost:3000/"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const BASE_URL = "https://api.spotify.com/v1"
    const SCOPE = 'playlist-modify-private'
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [results, setResults] = useState([])


    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")


        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const searchTracks = async (e) => {
        e.preventDefault()
        const { data } = await axios.get(`${BASE_URL}/search`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "track"
            }
        })

        setResults(data.tracks.items)
    }


    const renderTracks = () => {
        return results.map((artist) => (
            <List
                key={artist.id}
                title={artist.name}
                img={artist.album.images[0].url}
                artists={artist.artists[0].name}
                album={artist.album.name}

            />
        ))
    }

    return (
        <div>
            <div className="auth-log">
                {!token ?

                    <a className="log" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login
                        to Spotify</a>
                    : <button className="log" onClick={logout}>Logout</button>}

                {token ?
                    <form className='search' onSubmit={searchTracks}>
                        <input className='search' type="text" onChange={e => setSearchKey(e.target.value)} />
                        <button className='searchButton' type={"submit"}>Search</button>
                    </form>

                    : <div></div>
                }

                <div className="b">
                    <table className="b">
                        <h3>
                            {renderTracks()}
                        </h3>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;