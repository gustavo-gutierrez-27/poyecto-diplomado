#!/bin/bash

SERVER_IP="172.19.0.3"  # IP del contenedor servidor back-end
FRONT_IP="172.19.0.5"  # IP del contenedor servidor front-end

# Limpiar reglas existentes
iptables -F
iptables -t nat -F
iptables -X

# Redirigir tráfico entrante en el puerto 8080 al contenedor servidor en el puerto 8080
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination ${SERVER_IP}:8080

# Redirigir tráfico entrante en el puerto 80 al contenedor servidor en el puerto 3000
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination ${FRONT_IP}:3000

# Permitir todo el tráfico de loopback (para el firewall y contenedores internos)
iptables -A INPUT -i lo -j ACCEPT

# Bloquear todo el tráfico que no esté explícitamente permitido
iptables -A INPUT -j DROP

# Permitir tráfico enmascarado
iptables -t nat -A POSTROUTING -j MASQUERADE

echo "Reglas de iptables configuradas correctamente."
