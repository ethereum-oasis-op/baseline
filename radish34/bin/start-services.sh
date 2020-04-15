#!/bin/bash

echo "Use Node 11..."
nvm use 11

echo "Start dnsmasq..."
sudo systemctl restart dnsmasq.service
sudo systemctl enable dnsmasq.service
dig aws.amazon.com @127.0.0.1
sudo bash -c "echo 'supersede domain-name-servers 127.0.0.1, 169.254.169.253;' >> /etc/dhcp/dhclient.conf"
sudo dhclient
dig aws.amazon.com
