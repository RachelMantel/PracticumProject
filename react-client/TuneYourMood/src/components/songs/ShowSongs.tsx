import { useSelector } from "react-redux";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { SongType } from "../../models/songType";

const ShowSongs = ({ songs }: { songs: Array<SongType> }) => {
    const loading = useSelector((state: any) => state.songs?.loading || false);
    const error = useSelector((state: any) => state.songs?.error || null);
    console.log(songs);
    
    return (
        <>
            {/* <Typography variant="h5" sx={{ color: "#E91E63", mt: 3 }}>
                Songs in
            </Typography> */}
            {loading && <Typography variant="h6">Loading songs...</Typography>}
            {error && <Typography color="error">Error: {error}</Typography>}
            {songs.length > 0 ? (
                <Stack spacing={2}>
                    {songs.map((song: any) => (
                        <Card key={song.id} sx={{ display: "flex", alignItems: "center", p: 2, bgcolor: "white", color: "black" }}>
                            <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6">{song.songName}</Typography>
                                <Typography variant="body2" color="gray">
                                    {song.artist}
                                </Typography>
                            </CardContent>
                            <Button
                                sx={{ backgroundColor: "#E91E63", color: "white", fontWeight: "bold" }}
                                variant="contained"
                                color="primary"
                                startIcon={<PlayArrowIcon />}
                                onClick={() => window.open(song.filePath, "_blank")}
                            >
                                Play
                            </Button>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Typography>No songs available in this folder</Typography>
            )}
        </>
    );
};

export default ShowSongs;
