import { useConnect, useConnectors } from "wagmi";

export default function Login() {
  const { connect, isPending } = useConnect();
  const connectors = useConnectors();
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      disabled={isPending}
      onClick={() => {
        connect({ connector: connectors[0] });
      }}
    >
      {isPending ? "Connecting..." : "Connect"}
    </button>
  );
}
