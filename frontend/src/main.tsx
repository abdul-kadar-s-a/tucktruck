
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "leaflet/dist/leaflet.css";
import "./mapFix";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
