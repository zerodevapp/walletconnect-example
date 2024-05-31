import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DisconnectButton from "./components/Disconnect";
import './App.css'

function App() {
  const [hydration, setHydration] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => setHydration(true), [])

  if (!hydration) return null

  return (
    <div className="relative">
      {isConnected ? (
        <>
          <div className="absolute top-0 right-0">
            <DisconnectButton />
          </div>
          <Dashboard />
        </>
      ) : <Login />}
    </div>
  )
}

export default App
