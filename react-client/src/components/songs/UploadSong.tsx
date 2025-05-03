// import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
// import SongUploader from "./SongUploader";
// // import { useNavigate } from "react-router-dom";

// interface UploadSongProps {
//   open: boolean;
//   onClose: () => void;
// }

// const UploadSong: React.FC<UploadSongProps> = ({ open, onClose }) => {
// //   const navigate = useNavigate();

//   const handleUploadSuccess = () => {
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>
//         Upload a New Song
//         <IconButton onClick={onClose} sx={{ position: "absolute", right: 16, top: 16 }}>
//           ✖
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <SongUploader onUploadSuccess={handleUploadSuccess} />
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default UploadSong;
