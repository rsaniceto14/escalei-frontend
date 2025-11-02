import { useEffect } from "react";
import { App } from "@capacitor/app";

export  function useAppListener(navigate: (path: string|number) => void) {

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
