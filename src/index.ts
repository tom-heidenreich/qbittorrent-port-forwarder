import { QBitClient } from "./utils/qbit";
import Protonwire from "./provider/protonwire";

// login to qbit client
const client = new QBitClient();
const api = await client.auth();
console.log("Successfull login to client!");

// start provider
const protonwire = new Protonwire(api);
protonwire.start();
