// "use client"

// import { useState } from "react"
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Button,
//   IconButton,
//   Box,
//   Typography,
// } from "@mui/material"
// import { motion } from "framer-motion"
// import CloseIcon from "@mui/icons-material/Close"
// import EditIcon from "@mui/icons-material/Edit"
// import MusicNoteIcon from "@mui/icons-material/MusicNote"
// import type { SongType } from "../../models/songType"

// interface EditSongModalProps {
//   song: SongType | null
//   // folders: { id: number; folderName: string }[]
//   onClose: () => void
//   onSave: (updatedSong: SongType) => void
// }

// const moodChoices = ["natural", "happy", "sad", "excited", "angry", "relaxed", "hopeful", "grateful", "nervous"]

// const EditSong = ({ song, onClose, onSave }: EditSongModalProps) => {
//   const [editedSong, setEditedSong] = useState<SongType>(
//     song || { id: 0, songName: "", artist: "", mood_category: "", filePath: "", folderId: -1, userId: 0 },
//   )

//   if (!song) return null

//   const handleSave = () => {
//     onSave(editedSong)
//     onClose()
//   }

//   return (
//     <Dialog
//       open={!!song}
//       onClose={onClose}
//       fullWidth
//       maxWidth="sm"
//       PaperProps={{
//         component: motion.div,
//         initial: { opacity: 0, y: 50, scale: 0.9 },
//         animate: { opacity: 1, y: 0, scale: 1 },
//         exit: { opacity: 0, scale: 0.95 },
//         transition: { type: "spring", damping: 25, stiffness: 300 },
//         sx: {
//           borderRadius: "16px",
//           overflow: "hidden",
//           boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
//         },
//       }}
//     >
//       {/* Background gradient elements */}
//       <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "10%",
//             left: "5%",
//             width: "200px",
//             height: "200px",
//             borderRadius: "50%",
//             background: "radial-gradient(circle, rgba(233,30,99,0.05) 0%, transparent 70%)",
//           }}
//         />
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: "10%",
//             right: "5%",
//             width: "150px",
//             height: "150px",
//             borderRadius: "50%",
//             background: "radial-gradient(circle, rgba(255,87,34,0.05) 0%, transparent 70%)",
//           }}
//         />
//       </Box>

//       {/* Header with gradient */}
//       <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           background: "linear-gradient(90deg, #E91E63 0%, #FF5722 100%)",
//           color: "white",
//           position: "relative",
//           zIndex: 1,
//           px: 3,
//           py: 2,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <EditIcon sx={{ mr: 1 }} />
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             Edit Song
//           </Typography>
//         </Box>
//         <IconButton
//           component={motion.button}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={onClose}
//           sx={{
//             color: "white",
//             backgroundColor: "rgba(255, 255, 255, 0.2)",
//             "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       {/* Content */}
//       <DialogContent sx={{ px: 3, py: 4, position: "relative", zIndex: 1 }}>
//         <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//           <Box
//             sx={{
//               width: 50,
//               height: 50,
//               borderRadius: "50%",
//               background: "linear-gradient(135deg, #E91E63 0%, #FF5722 100%)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "white",
//               mr: 2,
//               boxShadow: "0 4px 12px rgba(233,30,99,0.3)",
//             }}
//           >
//             <MusicNoteIcon />
//           </Box>
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: "bold",
//               background: "linear-gradient(90deg, #E91E63, #FF5722)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             {song.songName}
//           </Typography>
//         </Box>

//         <TextField
//           autoFocus
//           fullWidth
//           margin="dense"
//           label="Song Name"
//           value={editedSong.songName}
//           onChange={(e) => setEditedSong({ ...editedSong, songName: e.target.value })}
//           variant="outlined"
//           sx={{
//             mb: 2.5,
//             "& .MuiOutlinedInput-root": {
//               "&:hover fieldset": {
//                 borderColor: "rgba(233,30,99,0.5)",
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "#E91E63",
//               },
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "#E91E63",
//             },
//           }}
//         />

//         <TextField
//           fullWidth
//           margin="dense"
//           label="Artist"
//           value={editedSong.artist}
//           onChange={(e) => setEditedSong({ ...editedSong, artist: e.target.value })}
//           variant="outlined"
//           sx={{
//             mb: 2.5,
//             "& .MuiOutlinedInput-root": {
//               "&:hover fieldset": {
//                 borderColor: "rgba(233,30,99,0.5)",
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "#E91E63",
//               },
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "#E91E63",
//             },
//           }}
//         />

//         {/* Select for mood category */}
//         <TextField
//           fullWidth
//           select
//           margin="dense"
//           label="Mood Category"
//           value={editedSong.mood_category}
//           onChange={(e) => setEditedSong({ ...editedSong, mood_category: e.target.value })}
//           variant="outlined"
//           sx={{
//             mb: 1,
//             "& .MuiOutlinedInput-root": {
//               "&:hover fieldset": {
//                 borderColor: "rgba(233,30,99,0.5)",
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "#E91E63",
//               },
//             },
//             "& .MuiInputLabel-root.Mui-focused": {
//               color: "#E91E63",
//             },
//           }}
//         >
//           {moodChoices.map((choice) => (
//             <MenuItem key={choice} value={choice}>
//               {choice.charAt(0).toUpperCase() + choice.slice(1)}
//             </MenuItem>
//           ))}
//         </TextField>
//       </DialogContent>

//       {/* Action buttons */}
//       <DialogActions sx={{ px: 3, pb: 3, position: "relative", zIndex: 1 }}>
//         <Button
//           component={motion.button}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={onClose}
//           sx={{
//             color: "#E91E63",
//             fontWeight: "medium",
//             "&:hover": {
//               backgroundColor: "rgba(233,30,99,0.05)",
//             },
//           }}
//         >
//           Cancel
//         </Button>

//         <Button
//           component={motion.button}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           variant="contained"
//           onClick={handleSave}
//           sx={{
//             background: "linear-gradient(90deg, #E91E63, #FF5722)",
//             color: "white",
//             fontWeight: "bold",
//             px: 3,
//             "&:hover": {
//               background: "linear-gradient(90deg, #D81B60, #F4511E)",
//               boxShadow: "0 4px 12px rgba(233,30,99,0.3)",
//             },
//           }}
//         >
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default EditSong
