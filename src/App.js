import logo from './logo.svg';

import Login from './components/Login';
import React, { lazy, Suspense,useRef,useContext, useState , useEffect} from 'react';
import {DataContext} from './components/DataContext';
import "react-toastify/dist/ReactToastify.css";
// import StartupAnimation from './components/StartupAnimation';
// import WebController from './components/WebController';
// import { ToastContainer } from "react-toastify";
const WebController = lazy(() => import('./components/WebController'));
const StartupAnimation = lazy(() => import('./components/StartupAnimation'));
const ToastContainer = lazy(() => 
  import("react-toastify").then(module => ({ default: module.ToastContainer }))
);

function App() {

 const [showStartup, setShowStartup] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  // Handle startup completion
  const handleStartupComplete = () => {
    setShowStartup(false);
    setIsAppReady(true);
  };

  const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    <h1>Fetching up</h1>
  </div>
);
  
  return (
    <div className="App">
  <Suspense fallback={<LoadingFallback />}>
  {showStartup && <StartupAnimation onComplete={handleStartupComplete} />}

      {isAppReady && (
    <DataContext>
     <WebController/>
        <ToastContainer position="top-right" autoClose={3000} />
    </DataContext>

      )}
</Suspense>
    </div>
  );
}

export default App;
