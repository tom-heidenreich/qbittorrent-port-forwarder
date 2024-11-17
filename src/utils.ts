import { $ } from "bun";

export async function getForwardedPort() {
    return (await $`natpmpc -a 1 0 tcp 60 -g 10.2.0.1 | grep -oP 'public\ port\ \K\w+'`.text()).trim()
}

export class QBitClient {
    
    private readonly host: string
    private readonly username: string
    private readonly password: string
    
    constructor() {
        if(!process.env.QBIT_HOST) throw Error("Environment variable QBIT_HOST is required!")
        this.host = process.env.QBIT_HOST

        if(!process.env.QBIT_USERNAME) throw Error("Environment variable QBIT_USERNAME is required!")
        this.username = process.env.QBIT_USERNAME

        if(!process.env.QBIT_PASSWORD) {
            // TODO: use docker secret instead
            throw Error("Environment variable QBIT_PASSWORD is required!")
        }
        this.password = process.env.QBIT_PASSWORD
    }

    public async auth(): Promise<QBitConnection> {
        const sid = (await $`curl -s -c - --header "Referer: http://${this.host}" --data "username=${this.username}&password=${this.password}" http://${this.host}/api/v2/auth/login | sed -n 's/.*SID\s*\(.*\)/\1/p'`.text()).trim()
        if(sid.length === 0) throw new Error(`Failed to login to ${this.host}!`)
        return new QBitConnection(this.host, sid);
    }
}

export class QBitConnection {
    constructor(
        private readonly host: string,
        private readonly sid: string
    ) {}

    public async setListenPort(listenPort: string) {
        const http_code = (await $`curl -s -o /dev/null -w '%{http_code}' -d "json={\"listen_port\": ${listenPort}}" --cookie "SID=${this.sid}" -X POST http://${this.host}/api/v2/app/setPreferences`.text()).trim()
        if(http_code.length === 0 || http_code !== '200') throw new Error(`Failed to update port to ${listenPort}!`)
    }
}