import { $ } from "bun";
import Provider from ".";
import { type QBitConnection } from "../utils/qbit";

async function getForwardedPort() {
  return (
    await $`curl -s http://$VPN_HOST/v1/openvpn/portforwarded | jq -r .port`.text()
  ).trim();
}

export default class Gluetun extends Provider {
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
