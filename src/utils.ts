import { $ } from "bun";

export async function getForwardedPort() {
  return (
    await $`natpmpc -a 1 0 tcp 60 -g 10.2.0.1 | grep -oP 'public\ port\ \K\w+'`.text()
  ).trim();
}

export class QBitClient {
  private readonly host: string;
  private readonly apiKey: string;

  constructor() {
    if (!process.env.QBIT_HOST)
      throw Error("Environment variable QBIT_HOST is required!");
    this.host = process.env.QBIT_HOST;

    if (!process.env.QBIT_API_KEY) {
      // TODO: use docker secret instead
      throw Error("Environment variable QBIT_API_KEY is required!");
    }
    this.apiKey = process.env.QBIT_API_KEY;
  }

  public async setListenPort(listenPort: string) {
    const http_code = (
      await $`curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer ${this.apiKey}" -d "json={\"listen_port\": ${listenPort}}" -X POST http://${this.host}/api/v2/app/setPreferences`.text()
    ).trim();
    if (http_code !== "200")
      throw new Error(
        `Failed to update port to ${listenPort}! (HTTP ${http_code})`,
      );
  }
}
