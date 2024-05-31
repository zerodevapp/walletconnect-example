import { useDisconnect } from "wagmi";

function DisconnectButton() {
  const { disconnect } = useDisconnect();

  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => disconnect()}
    >
      Disconnect Wallet
    </button>
  );
}

export default DisconnectButton;
