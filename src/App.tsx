import React, { useEffect, useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import MainMenu from "./screens/MainMenu";
import { Screen } from "./types";

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.SPLASH);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen(Screen.LOGIN);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (screen === Screen.SPLASH) return <WelcomeScreen />;
  if (screen === Screen.LOGIN)
    return <LoginScreen onLogin={() => setScreen(Screen.MAIN_MENU)} />;

  return <MainMenu />;
};

export default App;
