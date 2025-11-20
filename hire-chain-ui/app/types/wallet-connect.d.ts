// app/types/hedera-wallet-connect.d.ts

// Import types explicitly to avoid value/type confusion
import type { SignClient } from "@walletconnect/sign-client";
import type { SessionTypes } from "@walletconnect/types";

declare module "@hashgraph/hedera-wallet-connect" {
  // Extend the DAppConnector interface
  export interface DAppConnector {
    signClient: SignClient; // Now typed correctly as the imported type
    openModal: () => Promise<void>; // For connection
    // Add other extensions if needed
  }

  // If you need to reference SessionTypes elsewhere
  export type HederaSession = SessionTypes.Struct; // Example alias for session type
}
