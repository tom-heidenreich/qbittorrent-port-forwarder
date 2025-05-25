# qbittorrent-port-forwarder

A little container to update the port of qBittorrent when using a VPN forwarded port.

## Gluetun (OpenVPN) `recommended`
The recommended way. It uses the gluetun openvpn API to enable port forwarding.

### Docker Compose
```yml
services:
    gluetun:
        <YOUR-GLUETUN-CONFIG>
    qbittorrent:
        network_mode: service:gluetun
        <YOUR-QBITTORRENT-CONFIG>

    port-forwarder:
        image: qbittorrent-port-forwarder
        network_mode: service:gluetun
        depends_on:
        - qbittorrent
        container_name: port-forwarder
        restart: 'unless-stopped'
        environment:
        - PROVIDER=gluetun
        - QBIT_HOST=localhost:8080  # use localhost instead of container name
        - QBIT_USERNAME=<YOUR-QBITTORRENT-USERNAME>
        - QBIT_PASSWORD=<YOUR-QBITTORRENT-PASSWORD>
```

## ProtonWire (for ProtonVPN)

This is build for ProtonVPN, but may work with other vpns that support port forwarding.
Follow [these instructions](https://github.com/tprasadtp/protonvpn-docker#generating-wireguard-private-key) on creating a private key. Make sure you enable `NAT-PMP (Port Forwarding)`.

### Docker Compose

```yml
services:
    protonwire: # other vpns may also work
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
        - PROVIDER=protonwire
        - QBIT_HOST=localhost:8080  # use localhost instead of container name
        - QBIT_USERNAME=<YOUR-QBITTORRENT-USERNAME>
        - QBIT_PASSWORD=<YOUR-QBITTORRENT-PASSWORD>
```
