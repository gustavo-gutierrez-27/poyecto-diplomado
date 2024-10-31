# Usa una imagen base de Ubuntu
FROM ubuntu:22.04

# Actualiza la lista de paquetes
RUN apt-get update && \
    apt-get install -y iptables 

RUN update-alternatives --set iptables /usr/sbin/iptables-legacy

# Copia el script de configuración de iptables al contenedor
COPY rules-firewall.sh /usr/local/bin/setup_iptables.sh

# Haz que el script sea ejecutable
RUN chmod +x /usr/local/bin/setup_iptables.sh

EXPOSE 80
EXPOSE 8080

# Ejecuta el script de configuración de iptables y mantiene el contenedor activo
CMD ["/bin/bash", "-c", "/usr/local/bin/setup_iptables.sh && tail -f /dev/null"]
