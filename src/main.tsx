import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// GitHub Pages SPA fallback: restore route from sessionStorage
const storedRoute = sessionStorage.getItem('githubPagesRedirect');
if (storedRoute) {
  sessionStorage.removeItem('githubPagesRedirect');
  // Update the URL to the stored route before router initializes
  window.history.replaceState(null, '', storedRoute);
}

createRoot(document.getElementById("root")!).render(<App />);
