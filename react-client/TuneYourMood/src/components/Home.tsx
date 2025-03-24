import { Box } from "@mui/material";
import Header from "./Header"; // לוודא שזה הנתיב הנכון לקובץ Header שלך

const Home = () => {
  return (
    <>
      <Header /> {/* שומר על ה-Header למעלה */}
      <Box
        sx={{
          position: "absolute", // שומר את זה מתחת ל-Header
          top: "95px", // גובה ההדר (בהתאם לגובה ה-Header שלך)
          left: 0,
          width: "99vw",
          height: "calc(100vh - 95px)", // גובה המסך פחות ההדר
          backgroundImage: "url('/images/view.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* שכבת שקיפות */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // שכבת שקיפות כהה
            zIndex: 1,
          }}
        />
      </Box>
    </>
  );
};

export default Home;

