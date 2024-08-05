import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { sepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [[{ type: "email" as const }], [{ type: "passkey" as const }]],
    addPasskeyOnSignup: false,
  },
};

const chain = sepolia;

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

export const queryClient = new QueryClient();
