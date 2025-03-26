import { Paper, Typography, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SongType } from "../../models/songType";

interface MusicPlayerProps {
    song: SongType;
    onClose: () => void;
}

const MusicPlayer = ({ song, onClose }: MusicPlayerProps) => {
    return (
        <>
            {/* רקע חצי שקוף כהה שמכסה את כל המסך */}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // רקע כהה חצי שקוף
                    zIndex: 1000, // ודואג שזה יהיה מעל הכל
                }}
            />

            {/* הנגן עצמו */}
            <Box
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)", // ממקם את הנגן במרכז
                    zIndex: 1100, // שומר על זה מעל הרקע
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        width: 500,
                        padding: 3,
                        borderRadius: 6,
                        border: "3px solid #E91E63",
                        color: "black",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        background: "white",
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    {/* כפתור סגירה */}
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            top: 15,
                            right: 15,
                            color: "black",
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.6)" },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: "1.8rem" }} />
                    </IconButton>

                    {/* שם השיר */}
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, letterSpacing: 1 }}>
                        {song.songName}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8, mb: 2 }}>
                        {song.artist}
                    </Typography>

                    {/* אייקון מוזיקה */}
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
                            backgroundColor: "rgba(169, 169, 169, 0.7)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 3,
                            fontSize: "2.5rem",
                        }}
                    >
                        🎶
                    </Box>
                    <audio controls autoPlay style={{ width: "100%", marginTop: 20, borderRadius: 10 }}>
                        <source src={song.filePath} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </Paper>
            </Box>
        </>
    );
};

export default MusicPlayer;
