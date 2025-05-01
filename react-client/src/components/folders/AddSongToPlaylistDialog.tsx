// "use client"

// import { useState, useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import type { AppDispatch } from "../redux/store"
// import { addSongToFolder, fetchSongsByFolder } from "../redux/FolderSlice"
// import type { SongType } from "../../models/songType"
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Checkbox,
//   CircularProgress,
//   Typography,
//   Box,
//   InputAdornment,
//   IconButton,
//   Chip,
//   Divider,
// } from "@mui/material"
// import {
//   Search as SearchIcon,
//   MusicNote as MusicNoteIcon,
//   Close as CloseIcon,
//   Add as AddIcon,
// } from "@mui/icons-material"
// import { fetchUserSongs } from "../redux/SongSlice"

// interface AddSongToPlaylistDialogProps {
//   open: boolean
//   folderId: number
//   onClose: () => void
//   onSongsAdded?: () => void
// }

// const AddSongToPlaylistDialog = ({ open, folderId, onClose, onSongsAdded }: AddSongToPlaylistDialogProps) => {
//   const dispatch = useDispatch<AppDispatch>()
//   const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"))
//   const allSongs = useSelector((state: any) => state.songs?.songs || [])
//   const folderSongs = useSelector((state: any) => state.folders.songsByFolder[folderId] || [])
//   const loading = useSelector((state: any) => state.songs?.loading || false)

//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedSongs, setSelectedSongs] = useState<number[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Fetch all songs when dialog opens
//   useEffect(() => {
//     if (open) {
//       dispatch(fetchUserSongs(user?.id || 0))
//       if (folderId) {
//         dispatch(fetchSongsByFolder(folderId))
//       }
//     }
//   }, [dispatch, open, folderId])

//   // Filter out songs that are already in the playlist
//   const availableSongs = allSongs.filter(
//     (song: SongType) => !folderSongs.some((folderSong: SongType) => folderSong.id === song.id)
//   )

//   // Filter songs based on search term
//   const filteredSongs = availableSongs.filter(
//     (song: SongType) =>
//       song.songName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       song.artist.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handleToggleSong = (songId: number) => {
//     setSelectedSongs((prev) => (prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]))
//   }

//   const handleAddSongs = async () => {
//     if (selectedSongs.length === 0) return

//     setIsSubmitting(true)

//     try {
//       // Add each selected song to the folder
//       for (const songId of selectedSongs) {
//         const song = allSongs.find((s: SongType) => s.id === songId)
//         if (song) {
//           await dispatch(addSongToFolder({ folderId, song })).unwrap()
//         }
//       }

//       // Refresh songs in the folder
//       await dispatch(fetchSongsByFolder(folderId)).unwrap()

//       // Notify parent component
//       if (onSongsAdded) {
//         onSongsAdded()
//       }

//       // Close dialog and reset state
//       setSelectedSongs([])
//       setSearchTerm("")
//       onClose()
//     } catch (error) {
//       console.error("Failed to add songs to playlist:", error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 2,
//           maxHeight: "80vh",
//         },
//       }}
//     >
//       <DialogTitle sx={{ pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//           Add Songs to Playlist
//         </Typography>
//         <IconButton onClick={onClose} size="small">
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent dividers>
//         <TextField
//           fullWidth
//           placeholder="Search songs by name or artist..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           variant="outlined"
//           margin="normal"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//             endAdornment: searchTerm && (
//               <InputAdornment position="end">
//                 <IconButton size="small" onClick={() => setSearchTerm("")}>
//                   <CloseIcon fontSize="small" />
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             mb: 2,
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 2,
//             },
//           }}
//         />

//         {selectedSongs.length > 0 && (
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               Selected Songs: {selectedSongs.length}
//             </Typography>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//               {selectedSongs.map((songId) => {
//                 const song = allSongs.find((s: SongType) => s.id === songId)
//                 return (
//                   <Chip
//                     key={songId}
//                     label={song?.songName || "Unknown"}
//                     onDelete={() => handleToggleSong(songId)}
//                     color="primary"
//                     size="small"
//                   />
//                 )
//               })}
//             </Box>
//           </Box>
//         )}

//         <Divider sx={{ my: 1 }} />

//         {loading ? (
//           <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//             <CircularProgress size={40} />
//           </Box>
//         ) : filteredSongs.length > 0 ? (
//           <List sx={{ pt: 0 }}>
//             {filteredSongs.map((song: SongType) => (
//               <ListItem
//                 key={song.id}
//                 component="button"  // הוספתי את ה-component ככפתור
//                 onClick={() => handleToggleSong(song.id ?? 0)}
//                 sx={{
//                   borderRadius: 1,
//                   mb: 1, // מרווח בין הרשומות
//                   py: 1, // פדינג לגובה
//                   backgroundColor: selectedSongs.includes(song.id ?? 0) ? "rgba(233, 30, 99, 0.1)" : "transparent", // צבע רקע אם נבחר
//                   "&:hover": {
//                     bgcolor: "rgba(233, 30, 99, 0.2)", // צבע רקע בהובר
//                   },
//                   border: "none", // לא יהיה גבול
//                   width: "100%", // לא יכסה רק חלק
//                   textAlign: "left", // יישור טקסט שמאלה
//                 }}
//               >
//                 <ListItemIcon sx={{ minWidth: 40 }}>
//                   <Checkbox
//                     edge="start"
//                     checked={selectedSongs.includes(song.id ?? 0)}
//                     tabIndex={-1}
//                     disableRipple
//                     sx={{
//                       color: "#E91E63",
//                       "&.Mui-checked": {
//                         color: "#E91E63",
//                       },
//                     }}
//                   />
//                 </ListItemIcon>

//                 <ListItemIcon sx={{ minWidth: 40 }}>
//                   <MusicNoteIcon sx={{ color: "#E91E63" }} />
//                 </ListItemIcon>

//                 <ListItemText
//                   primary={song.songName}
//                   secondary={song.artist}
//                   primaryTypographyProps={{
//                     fontWeight: 500,
//                     variant: "body1",
//                   }}
//                   secondaryTypographyProps={{
//                     color: "text.secondary",
//                   }}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         ) : (
//           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4, flexDirection: "column" }}>
//             <MusicNoteIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
//             <Typography variant="body1" color="text.secondary">
//               {searchTerm
//                 ? "No songs match your search"
//                 : availableSongs.length === 0
//                   ? "All songs are already in this playlist"
//                   : "No songs available"}
//             </Typography>
//           </Box>
//         )}
//       </DialogContent>

//       <DialogActions sx={{ px: 3, py: 2 }}>
//         <Button
//           onClick={onClose}
//           variant="outlined"
//           sx={{
//             borderRadius: 2,
//             borderColor: "rgba(0, 0, 0, 0.23)",
//             color: "text.primary",
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={handleAddSongs}
//           variant="contained"
//           disabled={selectedSongs.length === 0 || isSubmitting}
//           startIcon={isSubmitting ? <CircularProgress size={20} /> : <AddIcon />}
//           sx={{
//             borderRadius: 2,
//             bgcolor: "#E91E63",
//             "&:hover": {
//               bgcolor: "#C2185B",
//             },
//           }}
//         >
//           {isSubmitting ? "Adding..." : `Add ${selectedSongs.length} ${selectedSongs.length === 1 ? "Song" : "Songs"}`}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default AddSongToPlaylistDialog
