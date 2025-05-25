import { $ } from "bun";
import Provider from ".";
import { type QBitConnection } from "../utils";

async function getForwardedPort() {
  return (
    await $`natpmpc -a 1 0 tcp 60 -g 10.2.0.1 | grep -oP 'public\ port\ \K\w+'`.text()
  ).trim();
}

export default class Protonwire extends Provider {
  public constructor(qbit: QBitConnection, interval?: number) {
    super(qbit, interval || 45000);
  }

  protected async execute() {
    const port = await getForwardedPort();
    console.log(`Port Forward enabled at port ${port}`);

    await this.qbit.setListenPort(port);
    console.log(`Updated listenPort successfully!`);

    console.log(`Will renew in ${Math.floor(this.interval / 1000)} seconds...`);
  }
}
