import { useConnect, useConnectors } from "wagmi";

export default function Login() {
  const { connect, isPending } = useConnect();
  const connectors = useConnectors();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <h1 className="text-2xl font-bold">Connect Wallet</h1>
      {connectors
        .filter((c) => c.type !== "injected")
        .map((connector, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            disabled={isPending}
            onClick={() => {
              connect({ connector: connector });
            }}
          >
            {isPending ? "Connecting..." : connector.name}
          </button>
        ))}
    </div>
  );
}
