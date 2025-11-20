"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode
} from "react";
import { LedgerId } from "@hashgraph/sdk";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@/store/auth.store";

interface WalletContextType {
  isConnected: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signAndExecuteTx: (transactionList: string) => Promise<any>;
  getSigner: () => any;
  getConnector: () => any;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dAppConnector, setDAppConnector] = useState<any>(null);

  const router = useRouter();
  const { setAuthenticatedAccountId, fetchFullUserData, logout } = useStore();

  // Load Hedera Wallet Connect library (CLIENT-SIDE ONLY)
  useEffect(() => {
    const loadHederaLib = async () => {
      try {
        const lib = await import("@hashgraph/hedera-wallet-connect");

        const metadata = {
          name: "Hirechain",
          description: "Decentralized Job matching",
          url: window.location.origin,
          icons: ["https://avatars.githubusercontent.com/u/31002956"]
        };

        console.log("Tring to load")
        const connector = new lib.DAppConnector(
          metadata,
          LedgerId.TESTNET,
          "8b1d72155f7f6e5b5a91a64b21e384fe",
          Object.values(lib.HederaJsonRpcMethod),
          [
            lib.HederaSessionEvent.ChainChanged,
            lib.HederaSessionEvent.AccountsChanged
          ],
          [lib.HederaChainId.Testnet, lib.HederaChainId.Mainnet]
        );

        setDAppConnector(connector);
      } catch (error) {
        console.error("Failed to load Hedera Wallet Connect:", error);
        toast.error("Failed to initialize wallet connector");
      }
    };

    loadHederaLib();
  }, []);

  // Initialize connector and restore session
  useEffect(() => {
    if (!dAppConnector) return;

    const initConnector = async () => {
      try {
        await dAppConnector.init({ logger: "error" });
        await dAppConnector.connect((uri: string) => {
          // console.log("WalletConnect URI:", uri);
        });

        const signer = dAppConnector.signers?.[0];
        if (signer) {
          const account = signer.getAccountId().toString();
          setAuthenticatedAccountId(account);
          setIsConnected(true);

          // Fetch full user data including stats and gigs
          await fetchFullUserData(account);
        }
      } catch (err) {
        console.error("Error initializing DAppConnector:", err);
      }
    };

    initConnector();
  }, [dAppConnector, setAuthenticatedAccountId, fetchFullUserData]);

  const connectWallet = useCallback(async () => {
    if (!dAppConnector) {
      toast.error("Wallet connector not initialized");
      return;
    }

    try {
      setIsLoading(true);
      await dAppConnector.openModal();

      const signer = dAppConnector.signers?.[0];
      if (!signer) {
        console.warn("No signer found after connection");
        toast.error("No wallet signer found");
        return;
      }

      const account = signer.getAccountId().toString();
      setAuthenticatedAccountId(account);
      setIsConnected(true);

      // Fetch full user data
      const userData = await fetchFullUserData(account);

      if (userData) {
        // console.log("User connected:", userData.profile.name);
        router.push("/dashboard");
        toast.success("Wallet connected successfully");
      } else {
        // User not found, redirect to registration
        router.push("/register");
        toast.info("Please complete your profile");
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      toast.error("Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  }, [dAppConnector, router, setAuthenticatedAccountId, fetchFullUserData]);

  const disconnectWallet = useCallback(async () => {
    if (!dAppConnector) return;

    try {
      setIsLoading(true);
      await dAppConnector.disconnect();

      setIsConnected(false);
      logout();

      toast.success("Wallet disconnected");

      // Reload to clear any cached state
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
      toast.error("Failed to disconnect wallet");
    } finally {
      setIsLoading(false);
    }
  }, [dAppConnector, logout]);

  const signAndExecuteTx = useCallback(
    async (transactionList: string) => {
      if (!isConnected || !dAppConnector) {
        throw new Error("Wallet not connected");
      }

      const signer = dAppConnector.signers?.[0];
      if (!signer) {
        throw new Error("No signer available");
      }

      const accountId = signer.getAccountId().toString();
      const params = {
        signerAccountId: accountId,
        transactionList
      };

      try {
        const tx = await dAppConnector.signAndExecuteTransaction(params);
        // console.log("Transaction result:", tx.result);
        return tx.result;
      } catch (err) {
        console.error("Transaction execution failed:", err);
        throw err;
      }
    },
    [isConnected, dAppConnector]
  );

  const getSigner = () => dAppConnector?.signers?.[0];
  const getConnector = () => dAppConnector;

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isLoading,
        connectWallet,
        disconnectWallet,
        signAndExecuteTx,
        getSigner,
        getConnector
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
