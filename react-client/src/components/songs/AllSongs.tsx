import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSongs } from "../redux/SongSlice";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import ShowSongs from "./ShowSongs";
import UploadSong from "./UploadSong";

const AllSongs = () => {
    const dispatch = useDispatch();
    const songs = useSelector((state: any) => state.songs?.songs || []);
    const loading = useSelector((state: any) => state.songs?.loading || false);
    const error = useSelector((state: any) => state.songs?.error || null);
    const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
    const [isUploadOpen, setUploadOpen] = useState(false);

    useEffect(() => {
        if (user && user.id) {
            dispatch(fetchUserSongs(user.id) as any);
        }
    }, [dispatch]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "80vh",
                    bgcolor: "#f5f5f5",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                }}
            >
                <CircularProgress sx={{ color: "#E91E63", marginBottom: "20px" }} />
                <Typography variant="h6" sx={{ color: "#E91E63", fontWeight: "bold" }}>
                    Loading your songs...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <>
            <Typography variant="h4" sx={{ color: "#E91E63", fontWeight: "bold" }}>
                My Songs
            </Typography>
            <Box display="flex" justifyContent="flex-end" margin="10px">
                <Button
                    sx={{ backgroundColor: "#E91E63", color: "white" }}
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setUploadOpen(true)}
                >
                    Add Song
                </Button>
            </Box>
            <UploadSong open={isUploadOpen} onClose={() => setUploadOpen(false)} />
            <ShowSongs songs={songs} />
        </>
    );
};

export default AllSongs;
