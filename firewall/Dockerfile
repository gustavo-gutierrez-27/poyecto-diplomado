# Usa una imagen base de Alpine
FROM alpine:latest

# Instala iptables (sin nftables) y bash
RUN apk add --no-cache iptables bash

# Copia el script de configuración al contenedor
COPY rules-firewall.sh /usr/local/bin/rules-firewall.sh
RUN chmod +x /usr/local/bin/rules-firewall.sh

# Comando por defecto
ENTRYPOINT ["/usr/local/bin/rules-firewall.sh"]
