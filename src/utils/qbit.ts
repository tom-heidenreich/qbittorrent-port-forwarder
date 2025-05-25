import { $ } from "bun";
import { env } from "./env";
import z from "zod/v4";

const Host = z.templateLiteral([z.string(), ":", z.int().positive().lt(65535)]);

export class QBitClient {
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;

  constructor() {
    this.host = env("QBIT_HOST", Host.parse);
    this.username = env("QBIT_USERNAME", z.string().parse);
    this.password = env("QBIT_PASSWORD", z.string().parse);
  }

  public async auth(): Promise<QBitConnection> {
    const sid = (
      await $`curl -s -c - --header "Referer: http://${this.host}" --data "username=${this.username}&password=${this.password}" http://${this.host}/api/v2/auth/login | sed -n 's/.*SID\s*\(.*\)/\1/p'`.text()
    ).trim();
    if (sid.length === 0) throw new Error(`Failed to login to ${this.host}!`);
    return new QBitConnection(this.host, sid);
  }
}

export class QBitConnection {
  constructor(private readonly host: string, private readonly sid: string) {}

  public async setListenPort(listenPort: string) {
    const http_code = (
      await $`curl -s -o /dev/null -w '%{http_code}' -d "json={\"listen_port\": ${listenPort}}" --cookie "SID=${this.sid}" -X POST http://${this.host}/api/v2/app/setPreferences`.text()
    ).trim();
    if (http_code.length === 0 || http_code !== "200")
      throw new Error(`Failed to update port to ${listenPort}!`);
  }
}
