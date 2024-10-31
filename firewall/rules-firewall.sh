#!/bin/sh

# Limpiar reglas previas
iptables -F
iptables -t nat -F

# Permitir tráfico del frontend al firewall en el puerto 3000
iptables -A INPUT -p tcp --dport 3000 -j ACCEPT

# Redirigir tráfico del frontend al backend a través del firewall (puerto 8443)
iptables -t nat -A PREROUTING -p tcp --dport 3000 -j DNAT --to-destination 172.19.0.3:8443

# Permitir tráfico redirigido del frontend al backend
iptables -A FORWARD -p tcp -d 172.19.0.3 --dport 8443 -j ACCEPT

# Bloquear cualquier tráfico externo hacia el backend que no pase por el firewall
iptables -A INPUT -p tcp --dport 8443 -j DROP

# Permitir todo el tráfico de loopback (para el firewall y contenedores internos)
iptables -A INPUT -i lo -j ACCEPT

# Bloquear todo el tráfico que no esté explícitamente permitido
iptables -A INPUT -j DROP
iptables -A FORWARD -j DROP

# Mantener el contenedor corriendo
tail -f /dev/null
