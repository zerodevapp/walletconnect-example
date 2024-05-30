import { useAccount } from "wagmi";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import './App.css'

function App() {
  const { isConnected } = useAccount();

  return (
    <div>
      {isConnected ? <Dashboard /> : <Login />}
    </div>
  )
}

export default App
