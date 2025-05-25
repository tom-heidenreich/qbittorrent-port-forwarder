import { QBitClient } from "./utils/qbit";
import Protonwire from "./provider/protonwire";
import Gluetun from "./provider/gluetun";
import { env } from "./utils/env";
import { z } from "zod/v4";
import type Provider from "./provider";

// login to qbit client
const client = new QBitClient();
const api = await client.auth();
console.log("Successfull login to client!");

// select provider
const ProviderNames = ["protonwire", "gluetun"] as const;
const PROVIDERS: Record<(typeof ProviderNames)[number], Provider> = {
  protonwire: new Protonwire(api),
  gluetun: new Gluetun(api),
};
const provider = PROVIDERS[env("PROVIDER", z.enum(ProviderNames).parse)];

// start provider
provider.start();
