import { useWriteContracts } from "wagmi/experimental";
import { useAccount } from "wagmi";
import { parseAbi } from "viem";

export default function MintButton() {
  const { writeContracts, isPending: isUserOpPending, error } = useWriteContracts();
  const { address } = useAccount();
  const tokenAddress = "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B";
  const abi = parseAbi(["function mint(address _to, uint256 amount) public"]);
  const paymasterUrl = `https://rpc.zerodev.app/api/v3/paymaster/${import.meta.env.VITE_SEPOLIA_PROJECT_ID}`

  return (
    <div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        disabled={isUserOpPending}
        onClick={() => {
          console.log("minting")
          writeContracts({
            contracts: [
              {
                address: tokenAddress,
                abi: abi,
                functionName: "mint",
                args: [address, 1],
                // value: BigInt(0),
              }
            ],
            capabilities: {
              paymasterService: {
                url: paymasterUrl,
              },
            },
          });
        }}
      >
        {isUserOpPending ? "Minting..." : "Mint"}
      </button>
      {error && <div>{error?.message}</div>}
    </div>
  );
}
