import React from "react";
import { IconButton } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';


interface DownloadButtonProps {
  songUrl: string;
  fileName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ songUrl, fileName }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(songUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "downloaded_song.mp3";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  return (
    <IconButton 
      onClick={handleDownload} 
      sx={{ color: "#E91E63" }} // צבע האייקון
    >
      <FileDownloadIcon />
    </IconButton>
  );
};

export default DownloadButton;
