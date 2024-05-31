import { useState } from "react";
// import { useAccount } from "wagmi";
import useWalletConnect from "../hooks/useWalletConnect";
import { useAccount } from "wagmi";
import MintButton from "../components/MintButton";
// import { zeroAddress } from "viem";

function Dashboard() {
  const { address, chainId } = useAccount();
  const [uri, setUri] = useState("");

  const {
    connect,
    sessionProposal,
    approveSessionProposal,
    rejectSessionProposal,
    isLoading,
    error,
    disconnect,
    sessions,
    sessionRequest,
    approveSessionRequest,
    rejectSessionRequest,
  } = useWalletConnect();

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">
        ZeroDev WalletConnect Demo
      </h1>
      <div>
        <p className="text-center mb-2">
          <strong>Address: </strong> {address}
        </p>
        <p className="text-center mb-2">
          {/* <strong>Is account deployed: </strong> {isDeployed ? "Yes" : "No"} */}
        </p>
        <MintButton />
        <p className="text-center mb-2">
          <strong>Chain: </strong> {chainId}
        </p>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 border border-gray-300"
          placeholder="URI"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => connect(uri)}
        >
          Connect
        </button>
      </div>
      {sessionProposal && (
        <div className="mb-4">
          <p className="mb-2">
            {sessionProposal.verifyContext.verified.origin}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() =>
                approveSessionProposal(
                  sessionProposal,
                  chainId?.toString() ?? "",
                  address!
                )
              }
            >
              Approve
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                console.log(sessionProposal)
                rejectSessionProposal(sessionProposal)
              }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
      {isLoading && <p className="text-center mb-2">Loading...{isLoading}</p>}
      {error && (
        <p className="text-red-500 text-center mb-2 break-words">
          Error: {error.message}
        </p>
      )}
      <h2 className="text-xl font-semibold mb-2">Sessions</h2>
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <div className="flex flex-row items-center gap-4 mb-2" key={session.topic}>
            <p>{session.peer.metadata.name}</p>
            <button
              className="ml-auto bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => disconnect(session)}
            >
              Disconnect Session
            </button>
          </div>
        ))
      ) : (
        <p className="text-center mb-2">No sessions</p>
      )}
      {sessionRequest && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Session Request</h3>
          <div className="mb-4">
            <p className="text-lg">
              <strong>Method:</strong> {sessionRequest.params.request.method}
            </p>
            <p className="break-words">
              <strong>Params:</strong>{" "}
              {JSON.stringify(sessionRequest.params.request.params)}
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() =>
                approveSessionRequest(sessionRequest, chainId?.toString() ?? "")
              }
            >
              Approve
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => rejectSessionRequest(sessionRequest)}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
