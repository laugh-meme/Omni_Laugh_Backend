export type ConnectionID =
  | `MAIN` | `SUB` | `SOCIAL`
  | `MAIN#0x${string}` 
  | `SUB#0x${string}` 
  | `SOCIAL#X` | `SOCIAL#X#${string}`;

export type WalletConnections = {
    MainWalletAddress: `0x${string}`;
    ConnectionID: ConnectionID;
    CreatedAt: string;
    // GSI_ConnectionLookupKey: string;
    // GSI_MainWalletAddress: `0x${string}`;
}

