"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { LedgerId } from "@hashgraph/sdk";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@/store/auth.store";

// ---------------------------------------------------------
// Context Types
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// Provider
// ---------------------------------------------------------
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dAppConnector, setDAppConnector] = useState<any>(null);
  const [hederaLib, setHederaLib] = useState<any>(null);

  const router = useRouter();
  const { setAuthenticatedAccountId, fetchFullUserData, logout } = useStore();

  // ---------------------------------------------------------
  // Load Hedera dynamically in the BROWSER ONLY
  // ---------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      if (typeof window === "undefined") return;

      try {
        console.log("Loading Hedera Wallet Connect...");
        const lib = await import("@hashgraph/hedera-wallet-connect");
        setHederaLib(lib); // store library instance
        console.log("Hedera Wallet lib loaded.");
      } catch (err) {
        console.error("Failed to dynamically import Hedera:", err);
        toast.error("Failed to load Hedera wallet connector");
      }
    };

    load();
  }, []);

  // ---------------------------------------------------------
  // Initialize connector when lib becomes available
  // ---------------------------------------------------------
  useEffect(() => {
    const initConnector = async () => {
      if (!hederaLib) return;
      try {
        console.log("Initializing DAppConnector...");

        const metadata = {
          name: "Hirechain",
          description: "Decentralized Job Matching",
          url: window.location.origin,
          icons: ["https://avatars.githubusercontent.com/u/31002956"],
        };

        const connector = new hederaLib.DAppConnector(
          metadata,
          LedgerId.TESTNET,
          "8b1d72155f7f6e5b5a91a64b21e384fe",
          Object.values(hederaLib.HederaJsonRpcMethod),
          [
            hederaLib.HederaSessionEvent.ChainChanged,
            hederaLib.HederaSessionEvent.AccountsChanged,
          ],
          [hederaLib.HederaChainId.Testnet, hederaLib.HederaChainId.Mainnet]
        );

        await connector.init({ logger: "error" });
        setDAppConnector(connector);

        const signer = connector.signers?.[0];
        if (signer) {
          const account = signer.getAccountId().toString();
          setAuthenticatedAccountId(account);
          setIsConnected(true);
          await fetchFullUserData(account);
        }
      } catch (err) {
        console.error("Error initializing connector:", err);
      }
    };

    initConnector();
  }, [hederaLib, setAuthenticatedAccountId, fetchFullUserData]);

  // ---------------------------------------------------------
  // Connect wallet
  // ---------------------------------------------------------
  const connectWallet = useCallback(async () => {
    try {
      if (!dAppConnector) {
        toast.info("Wallet is still initializing...");
        return;
      }

      setIsLoading(true);
      await dAppConnector.openModal();

      const signer = dAppConnector.signers?.[0];
      if (!signer) {
        toast.error("No signer found");
        return;
      }

      const account = signer.getAccountId().toString();
      setAuthenticatedAccountId(account);
      setIsConnected(true);

      const userData = await fetchFullUserData(account);
      if (userData) {
        router.push("/dashboard");
        toast.success("Wallet connected successfully");
      } else {
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

  // ---------------------------------------------------------
  // Disconnect wallet
  // ---------------------------------------------------------
  const disconnectWallet = useCallback(async () => {
    if (!dAppConnector) return;

    try {
      setIsLoading(true);
      await dAppConnector.disconnect();
      logout();
      setIsConnected(false);
      toast.success("Wallet disconnected");
      window.location.href = "/login";
    } catch (err) {
      console.error("Wallet disconnect error:", err);
      toast.error("Failed to disconnect wallet");
    } finally {
      setIsLoading(false);
    }
  }, [dAppConnector, logout]);

  // ---------------------------------------------------------
  // Sign + execute
  // ---------------------------------------------------------
  const signAndExecuteTx = useCallback(
    async (transactionList: string) => {
      if (!isConnected || !dAppConnector) {
        throw new Error("Wallet not connected");
      }

      const signer = dAppConnector.signers?.[0];
      if (!signer) throw new Error("No signer available");

      const accountId = signer.getAccountId().toString();
      const params = { signerAccountId: accountId, transactionList };

      try {
        const tx = await dAppConnector.signAndExecuteTransaction(params);
        return tx.result;
      } catch (err) {
        console.error("Transaction failed:", err);
        throw err;
      }
    },
    [isConnected, dAppConnector]
  );

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isLoading,
        connectWallet,
        disconnectWallet,
        signAndExecuteTx,
        getSigner: () => dAppConnector?.signers?.[0],
        getConnector: () => dAppConnector,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// ---------------------------------------------------------
// Hook
// ---------------------------------------------------------
export const useWallet = (): WalletContextType => {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used inside WalletProvider");
  }
  return ctx;
};
