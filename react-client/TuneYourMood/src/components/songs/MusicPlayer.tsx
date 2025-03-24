import { Paper, Typography, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SongType } from "../../models/songType";

interface MusicPlayerProps {
    song: SongType;
    onClose: () => void;
}

const MusicPlayer = ({ song, onClose }: MusicPlayerProps) => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <Paper
                elevation={8}
                // sx={{
                //     width: 500, // רוחב רחב יותר
                //     padding: 3,
                //     borderRadius: 6,
                //     background: "linear-gradient(135deg, #ff416c, #ff4b2b)", // צבעים מרהיבים
                //     color: "black",
                //     display: "flex",
                //     flexDirection: "column",
                //     alignItems: "center",
                //     textAlign: "center",
                //     position: "relative",
                //     boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                //     transition: "all 0.3s ease",
                // }}
                sx={{
                    width: 500, // רוחב רחב יותר
                    padding: 3,
                    borderRadius: 6,
                    border: "3px solid #E91E63", // הוספתי מסגרת בגוון E91E63
                    color: "black",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                    transition: "all 0.3s ease",
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
                        backgroundColor: "rgba(169, 169, 169, 0.7)", // צבע אפור חזק יותר
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

                {/* נגן המוזיקה */}
                <audio controls autoPlay style={{ width: "100%", marginTop: 20, borderRadius: 10 }}>
                    <source src={song.filePath} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </Paper>
        </Box>
    );
};

export default MusicPlayer;
