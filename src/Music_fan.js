import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./Music_fan.css";
import {
  Button,
  DataTable,
  DataTableContent,
  DataTableCell,
  DataTableBody,
  DataTableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogButton,
  DialogActions
} from "rmwc";
import "rmwc/dist/styles";
import spotifyIcon from "./spotifyIcon.png";

class Music_fan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tracks: [],
      selectedTrack: "",
      lyricsVisible: false,
      trackLyrics: ""
    };

    this.openSpotifyLink = this.openSpotifyLink.bind(this);
  }

  componentDidMount() {
    const url =
      "https://api.spotify.com/v1/artists/3WrFJ7ztbogyGnTHbHJFl2/top-tracks?market=US";
    fetch(url, {
      headers: {
        Authorization:
          "Bearer BQBvKbmXOmnuBIwve-9cRHtQ1Jcg6y65Ns9x8O72u3EWTl2EpIFcx6HdTnXu4nFm2lhuxt0U_sWVsvmuSsZyTN3OYGlHWeQ5f_gb5pSxEgKbgVhjeDAWYLOimtwbXdWkzdcbOPyptH0c8yOlxyPgsFg3tUaxazu57a_StZ87bjYTGnc"
      }
    })
      .then(res => res.json())
      .then(result => {
        this.setState({ tracks: result.tracks, loading: false });
      })
      .catch(error => console.log(error));
  }

  openSpotifyLink(link: string) {
    window.open(link, "_newtab");
  }

  render() {
    return (
      <div className="container">
        <div className="title">
          <h2>Hello Beatles fan! This is the place for you.</h2>
          <h3>
            {" "}
            Below you can find Beatles top tracks and their lyrics. Enjoy!
          </h3>
        </div>

        {this.state.loading ? (
          <div>loading...</div>
        ) : (
          <div className="tracklist">
            <DataTable
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                display: "flex"
              }}
            >
              <DataTableContent>
                <DataTableBody>
                  {this.state.tracks.map(btl_tracks => (
                    <DataTableRow>
                      <DataTableCell
                        style={{ color: "black", fontWeight: "bold" }}
                      >
                        {btl_tracks.name.substring(
                          0,
                          btl_tracks.name.indexOf("-")
                        )}
                      </DataTableCell>
                      <DataTableCell>
                        <Button
                          raised
                          style={{
                            backgroundColor: "#1DB954",
                            color: "black",
                            fontWeight: "bold"
                          }}
                          onClick={() => {
                            this.openSpotifyLink(
                              btl_tracks.external_urls.spotify
                            );
                          }}
                          icon={spotifyIcon}
                          label="Listen on Spotify"
                        />
                      </DataTableCell>
                      <DataTableCell>
                        <Button
                          label="Lyrics"
                          style={{ color: "black", fontWeight: "bold" }}
                          onClick={() => {
                            const songName = btl_tracks.name.substring(
                              0,
                              btl_tracks.name.indexOf("-")
                            );
                            const url =
                              "https://api.lyrics.ovh/v1/The%20Beatles/" +
                              songName;
                            fetch(url)
                              .then(res => res.text())
                              .then(result => {
                                if (result === `{"lyrics":""}`) {
                                  this.setState({
                                    lyricsVisible: true,
                                    selectedTrack: btl_tracks.name.substring(
                                      0,
                                      btl_tracks.name.indexOf("-")
                                    ),
                                    trackLyrics: "Sorry! Lyrics not found."
                                  });
                                } else {
                                  this.setState({
                                    lyricsVisible: true,
                                    selectedTrack: btl_tracks.name.substring(
                                      0,
                                      btl_tracks.name.indexOf("-")
                                    ),
                                    trackLyrics: result
                                  });
                                }
                                console.log(result);
                              })
                              .catch(error => console.log(error));
                          }}
                        />
                      </DataTableCell>
                    </DataTableRow>
                  ))}
                </DataTableBody>
              </DataTableContent>
            </DataTable>

            <Dialog
              open={this.state.lyricsVisible}
              onClose={evt => {
                this.setState({ lyricsVisible: false });
                console.log(evt.detail.action);
              }}
            >
              <DialogTitle>{this.state.selectedTrack}</DialogTitle>
              <DialogContent>{this.state.trackLyrics}</DialogContent>
              <DialogActions>
                <DialogButton action="close">Cancel</DialogButton>
                <DialogButton action="accept" isDefaultAction>
                  Ok
                </DialogButton>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </div>
    );
  }
}

export default Music_fan;
