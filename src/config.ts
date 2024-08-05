import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { arbitrumSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [[{ type: "email" as const }], [{ type: "passkey" as const }]],
    addPasskeyOnSignup: false,
  },
};

export const chain = arbitrumSepolia;

export const config = createConfig(
  {
    rpcUrl: "/api/rpc/chain/" + chain.id,
    signerConnection: { rpcUrl: "/api/rpc" },
    chain,
    ssr: true,
    storage: cookieStorage,
  },
  uiConfig
);

export const accountType = "MultiOwnerModularAccount";
// setup the gas policy for sponsoring transactions
export const gasManagerConfig = {
  policyId: process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID!,
};
// additional options for our account client
export const accountClientOptions = {
  txMaxRetries: 20,
};

export const queryClient = new QueryClient();
