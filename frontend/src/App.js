import { forwardRef, useEffect, useState } from "react";
import ThemeSettings from "./components/settings";
import Router from "./routes";
import ThemeProvider from "./theme";

import { Slide, Snackbar, useTheme, useMediaQuery } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { useDispatch, useSelector } from "react-redux";
import { HideSnackbar } from "./redux/slices/userSlice";

import ReactGA from "react-ga4";
import { Helmet } from "react-helmet"; // ✅ Add Helmet import

// Initialize Google Analytics (if available)
if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
  ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID);
}

// Snackbar positioning
const vertical = "top";
const horizontal = "right";

// Custom Alert component for Snackbar
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Slide transition for Snackbar
function SlideTransition(props) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return <Slide {...props} direction={isSmallScreen ? "down" : "left"} />;
}

function App() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Redux state for Snackbar
  const { open, message, severity } = useSelector(
    (state) => state.user.snackbar
  );

  const dispatch = useDispatch();

  // Local state to manage Snackbar visibility
  const [localOpen, setLocalOpen] = useState(false);

  // Sync Snackbar open state with Redux
  useEffect(() => {
    setLocalOpen(open);
  }, [open]);

  // Close Snackbar handler
  const handleCloseSnackbar = () => {
    setLocalOpen(false);
    setTimeout(() => {
      dispatch(HideSnackbar());
    }, 300);
  };

  return (
    <>
      {/* ✅ Helmet Section — controls browser tab title & meta tags */}
      <Helmet>
        <title>ConnectGO | Real-Time MERN Chat App by Arindom Saikia</title>
        <meta
          name="description"
          content="ConnectGO is a real-time MERN-based chat application built by Arindom Saikia. Connect, chat, and share seamlessly."
        />
        <meta
          property="og:title"
          content="ConnectGO | Real-Time MERN Chat App"
        />
        <meta
          property="og:description"
          content="Join ConnectGO — a modern real-time chat app built using the MERN stack."
        />
        <meta
          property="og:image"
          content="https://connectgo.netlify.app/logo.ico"
        />
      </Helmet>

      {/* ✅ Your app theme + routes */}
      <ThemeProvider>
        <ThemeSettings>
          <Router />
        </ThemeSettings>
      </ThemeProvider>

      {/* ✅ Snackbar for user notifications */}
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: isSmallScreen ? "center" : "right",
        }}
        open={localOpen}
        autoHideDuration={5000}
        key={vertical + horizontal}
        onClose={handleCloseSnackbar}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
