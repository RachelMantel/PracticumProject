import { TextField } from "@mui/material";

const SearchBar = ({ onSearch }: { onSearch: (value: string) => void }) => {
  return (
    <TextField
      label="Search"
      variant="outlined"
      onChange={(e) => onSearch(e.target.value)} // הפונקציה onSearch מקבלת את המילה שהוקלדה
      sx={{ width: 300 }}
    />
  );
};

export default SearchBar;
