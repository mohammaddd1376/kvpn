
```
sudo apt update && sudo apt upgrade -y

sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt-get update
sudo apt-get install nodejs -y


git clone https://github.com/lokidv/ovpn.git
mv ovpn/ /home
cd /home
mkdir bvpn
mv ovpn/* bvpn/
rm -r ovpn/


cd bvpn/
rm openvpn-install.sh
wget https://raw.githubusercontent.com/angristan/openvpn-install/0f324ef3b9f50c765838a8cb626d2a7a6674ca1d/openvpn-install.sh
chmod +x openvpn-install.sh
./openvpn-install.sh
npm i


nano /etc/systemd/system/bvpn.service

[Unit]
Description=Tunnel WireGuard with udp2raw
After=network.target

[Service]
Type=simple
User=root
ExecStart=sudo node /home/bvpn/main.js
Restart=no

[Install]
WantedBy=multi-user.target

systemctl enable --now bvpn.service 


nano /etc/openvpn/server.conf
tun-mtu 1380
mssfix 1340

nano /etc/openvpn/client-template.txt
tun-mtu 1380
mssfix 1340

systemctl restart openvpn


crontab -e
* * * * * /bin/systemctl is-active --quiet udp2raw.service || /bin/systemctl restart udp2raw.service
*/10 * * * * /bin/systemctl restart bvpn.service
or



```
for crontab

```
export VISUAL=nano; crontab -e

* 12 * * * reboot


```

for transfer
```
cd /
tar czvf openvpn_backup.tar.gz /etc/openvpn/ /etc/openvpn/easy-rsa/
scp openvpn_backup.tar.gz root@ip:/root
tar xzvf openvpn_backup.tar.gz
sudo systemctl stop openvpn@server.service
rm -r /etc/openvpn/
mv etc/openvpn /etc
nano /etc/systemd/system/udp2raw.service
```

