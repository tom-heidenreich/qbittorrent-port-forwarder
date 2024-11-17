# qbittorrent-port-forwarder

A little container to update the port of qBittorrent when using a VPN forwarded port.
It is build for protonwire, but should work with any vpn that supports port forwarding.

# Docker Compose
```yml
services:
    protonwire:
        <YOUR-PROTONWIRE-CONFIG>
    qbittorrent:
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