import { useEffect } from "react";

let App: any;
try {
  App = require("@capacitor/app").App;
} catch (err) {
  console.warn("Capacitor App plugin not available:", err);
  App = {
    addListener: () => {},
    removeAllListeners: () => {}
  };
}

export function useAppListener(navigate: (path: string | number) => void) {
  useEffect(() => {
    const handler = () => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        console.debug("No history, navigating to home");
        navigate("/home"); // fallback ou rota inicial
      }
    };

    App.addListener("backButton", handler);

    // cleanup no unmount
    return () => {
      App.removeAllListeners();
    };
  }, [navigate]);
}
