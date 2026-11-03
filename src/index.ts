import { $, sleep } from "bun";
import { getForwardedPort, QBitClient } from "./utils";

// login to qbit client
const api = new QBitClient();

while (true) {
  try {
    const port = await getForwardedPort();
    console.log(`Port Forward enabled at port ${port}`);

    await api.setListenPort(port);
    console.log(`Updated listenPort successfully!`);

    console.log(`Will renew in 45 seconds...`);
    await sleep(45000);
  } catch (e) {
    console.log(`Encounter error: ${e}. Retrying in 20 seconds...`);
  }
}
