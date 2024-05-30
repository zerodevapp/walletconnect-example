import { useCallback, useState, useEffect } from "react";
import { WalletConnectKernelService } from "@zerodev/walletconnect";
import { KernelEIP1193Provider } from "@zerodev/wallet";
import type { EntryPoint } from "permissionless/types";
import type { SessionTypes, CoreTypes } from "@walletconnect/types";
import type { Web3WalletTypes } from "@walletconnect/web3wallet";
import { useAccount } from "wagmi";

export type WalletConnectParams = {
  projectId?: string;
  metadata?: CoreTypes.Metadata;
};

function useWalletConnect(wcConfig: WalletConnectParams) {
  const [service, setService] = useState<WalletConnectKernelService | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessions, setSessions] = useState<SessionTypes.Struct[]>([]);
  const [sessionProposal, setSessionProposal] =
    useState<Web3WalletTypes.SessionProposal | null>(null);
  const [sessionRequest, setSessionRequest] =
    useState<Web3WalletTypes.SessionRequest | null>(null);
  const { connector, isConnected } = useAccount();

  useEffect(() => {
    const initialize = async () => {
      const provider = connector?.getProvider();
      const kernelService = new WalletConnectKernelService();
      try {
        await kernelService.init({
          walletConnectProjectId: wcConfig.projectId || "",
          walletConnectMetadata: wcConfig.metadata || {},
          kernelProvider:
            provider as unknown as KernelEIP1193Provider<EntryPoint>,
        });
        setService(kernelService);

        // Subscribe to session requests
        kernelService.onSessionRequest((request) => {
          setSessionRequest(request);
        });

        // Subscribe to session proposals
        kernelService.onSessionProposal((proposal) => {
          setSessionProposal(proposal);
        });

        // Subscribe to session additions and deletions
        const updateSessions = () => {
          setSessions(kernelService.getActiveSessions() || []);
        };
        kernelService.onSessionAdd(updateSessions);
        kernelService.onSessionDelete(updateSessions);
      } catch (e) {
        setError(e as Error);
      }
    };
    if (isConnected && connector) {
      initialize();
    }
  }, [connector, isConnected, wcConfig]);

  const connect = useCallback(
    async (uri: string) => {
      if (!service) return;
      setIsLoading(true);
      try {
        await service.connect(uri);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const disconnect = useCallback(
    async (session: SessionTypes.Struct) => {
      if (!service) return;
      setIsLoading(true);
      try {
        await service.disconnect(session);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const approveSessionProposal = useCallback(
    async (
      proposal: Web3WalletTypes.SessionProposal,
      chainId: string,
      address: string
    ) => {
      if (!service) return;
      setIsLoading(true);
      try {
        await service.approveSessionProposal(proposal, chainId, address);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
        setSessionProposal(null);
      }
    },
    [service]
  );

  const rejectSessionProposal = useCallback(
    async (proposal: Web3WalletTypes.SessionProposal) => {
      if (!service) return;
      setIsLoading(true);
      try {
        await service.rejectSessionProposal(proposal);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
        setSessionProposal(null);
      }
    },
    [service]
  );

  const approveSessionRequest = useCallback(
    async (request: Web3WalletTypes.SessionRequest, chainId: string) => {
      if (!service) return;
      setIsLoading(true);
      try {
        await service.approveSessionRequest(request, chainId);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
        setSessionRequest(null);
      }
    },
    [service]
  );

  const rejectSessionRequest = useCallback(
    async (request: Web3WalletTypes.SessionRequest) => {
      if (!service) return;
      setIsLoading(true);
      try {
        await service.rejectSessionRequest(request);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
        setSessionRequest(null);
      }
    },
    [service]
  );

  return {
    connect,
    disconnect,
    approveSessionProposal,
    rejectSessionProposal,
    approveSessionRequest,
    rejectSessionRequest,
    error,
    isLoading,
    sessions,
    sessionProposal,
    sessionRequest,
  };
}

export default useWalletConnect;
