import { createAgent } from "@veramo/core";
import {
  DIDConfigurationPlugin,
  IWellKnownDidConfigurationPlugin,
} from "veramo-plugin-did-config";
import { MessageHandler } from "@veramo/message-handler";
import { CredentialIssuer, W3cMessageHandler } from "@veramo/credential-w3c";
import { UniversalResolver } from "@veramo/did-resolver";
import { JwtMessageHandler } from "@veramo/did-jwt";

export const agent = createAgent<IWellKnownDidConfigurationPlugin & UniversalResolver>({
  plugins: [
    new DIDConfigurationPlugin(),
    new MessageHandler({
      messageHandlers: [new JwtMessageHandler(), new W3cMessageHandler()],
    }),
    new UniversalResolver({
      url: "https://uniresolver.io/1.0/identifiers/",
    }),
    new CredentialIssuer(),
  ],
});