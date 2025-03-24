// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserSongs } from "../redux/SongSlice";
// import { Button, Card, CardContent, Typography, Stack } from "@mui/material";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// const AllSongs = () => {
//     const dispatch = useDispatch();
//     const songs = useSelector((state: any) => state.songs?.songs || []);
//     const loading = useSelector((state: any) => state.songs?.loading || false);
//     const error = useSelector((state: any) => state.songs?.error || null);  
//     const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  
//     useEffect(() => {
//       if (user && user.id) {
//         dispatch(fetchUserSongs(user.id) as any);
//       }
//     }, [dispatch]);
  
  
//     // סינון השירים שה-folderId שלהם הוא -1
//     const filteredSongs = songs.filter((song: any) => song.folderId === -1);
  
//     if (loading) return <Typography variant="h6">Loading...</Typography>;
//     if (error) return <Typography color="error">Error: {error}</Typography>;
  
//     return (
//       <>
  
//         {filteredSongs.length > 0 ? (
//           <Stack spacing={2}>
//             {filteredSongs.map((song: any) => (
//               <Card key={song.id} sx={{ display: "flex", alignItems: "center", p: 2, bgcolor: "#212121", color: "white" }}>
//                 <CardContent sx={{ flex: 1 }}>
//                   <Typography variant="h6">{song.songName}</Typography>
//                   <Typography variant="body2" color="gray">
//                     {song.artist}
//                   </Typography>
//                 </CardContent>
//                 <Button
//                   sx={{ backgroundColor: "#E91E63", color: "white", fontWeight: "bold" }}
//                   variant="contained"
//                   color="primary"
//                   startIcon={<PlayArrowIcon />}
//                   onClick={() => window.open(song.filePath, "_blank")}
//                 >
//                   Play
//                 </Button>
//               </Card>
//             ))}
//           </Stack>
//         ) : (
//           <Typography>No songs available</Typography>
//         )}

//       </>
//     );
//   };
  
//   export default AllSongs;
  
  import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSongs } from "../redux/SongSlice";
import { Typography } from "@mui/material";
import ShowSongs from "./ShowSongs"; // ✅ ייבוא הקומפוננטה

const AllSongs = () => {
    const dispatch = useDispatch();
    const songs = useSelector((state: any) => state.songs?.songs || []);
    const loading = useSelector((state: any) => state.songs?.loading || false);
    const error = useSelector((state: any) => state.songs?.error || null);  
    const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

    useEffect(() => {
        if (user && user.id) {
            dispatch(fetchUserSongs(user.id) as any);
        }
    }, [dispatch]);

    // סינון השירים שה-folderId שלהם הוא -1
    const filteredSongs = songs.filter((song: any) => song.folderId === -1);

    if (loading) return <Typography variant="h6">Loading...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <>
            <ShowSongs songs={filteredSongs} /> {/* ✅ העברת השירים לקומפוננטה */}
        </>
    );
};

export default AllSongs;
