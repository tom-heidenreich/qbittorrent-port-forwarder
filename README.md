# qbittorrent-port-forwarder

A little container to update the port of qBittorrent when using a VPN forwarded port.
It is build for ProtonVPN, but should work with any vpn that supports port forwarding.

# ProtonVPN
Follow [these instructions](https://github.com/tprasadtp/protonvpn-docker#generating-wireguard-private-key) on creating a private key. Make sure you enable `NAT-PMP (Port Forwarding)`.

# Docker Compose
```yml
services:
    protonwire: # use any vpn that supports port forwarding
        <YOUR-PROTONWIRE-CONFIG>
    qbittorrent:
        network_mode: service:protonwire
        <YOUR-QBITTORRENT-CONFIG>

    port-forwarder:
        image: qbittorrent-port-forwarder
        network_mode: service:protonwire
        depends_on:
        - qbittorrent
        container_name: port-forwarder
        restart: 'unless-stopped'
        environment:
        - QBIT_HOST=localhost:8080  # use localhost instead of container name
        - QBIT_USERNAME=<YOUR-QBITTORRENT-USERNAME>
        - QBIT_PASSWORD=<YOUR-QBITTORRENT-PASSWORD>
```