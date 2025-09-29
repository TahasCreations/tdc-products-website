# 🚀 VPS Deployment Rehberi

## VPS Seçenekleri

### Türkiye'den VPS Sağlayıcıları:
- **DigitalOcean**: $5/ay (1GB RAM)
- **Vultr**: $2.50/ay (512MB RAM)
- **Linode**: $5/ay (1GB RAM)
- **AWS EC2**: $3.50/ay (t3.micro)
- **Google Cloud**: $5/ay (e2-micro)

### Türk VPS Sağlayıcıları:
- **Turhost**: ₺50/ay
- **Natro**: ₺60/ay
- **Hostinger**: ₺45/ay

## Kurulum Adımları

### 1. VPS'e Bağlanma
```bash
ssh root@your-vps-ip
```

### 2. Sistem Güncelleme
```bash
apt update && apt upgrade -y
```

### 3. Node.js Kurulumu
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
```

### 4. PM2 Kurulumu (Process Manager)
```bash
npm install -g pm2
```

### 5. Projeyi VPS'e Kopyalama
```bash
# Local'den VPS'e
scp -r . root@your-vps-ip:/var/www/tdc-website

# VPS'te
cd /var/www/tdc-website
npm install
npm run build
```

### 6. PM2 ile Başlatma
```bash
pm2 start npm --name "tdc-website" -- start
pm2 startup
pm2 save
```

### 7. Nginx Reverse Proxy
```bash
apt install nginx -y
```

Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8. SSL Sertifikası (Let's Encrypt)
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Otomatik Deployment

### GitHub Actions ile:
```yaml
name: Deploy to VPS
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to VPS
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.VPS_SSH_KEY }}
        script: |
          cd /var/www/tdc-website
          git pull origin main
          npm install
          npm run build
          pm2 restart tdc-website
```

## Maliyet Karşılaştırması

### Vercel:
- **Ücretsiz**: 100GB bandwidth
- **Pro**: $20/ay (1TB bandwidth)
- **Sınır**: Serverless functions

### VPS:
- **Başlangıç**: $5/ay
- **Orta**: $10-20/ay
- **Avantaj**: Tam kontrol, sınırsız

## Güvenlik

### Firewall Ayarları:
```bash
ufw allow ssh
ufw allow http
ufw allow https
ufw enable
```

### Fail2Ban:
```bash
apt install fail2ban -y
systemctl enable fail2ban
```

### Otomatik Backup:
```bash
# Günlük backup script
#!/bin/bash
tar -czf /backups/tdc-$(date +%Y%m%d).tar.gz /var/www/tdc-website
find /backups -name "*.tar.gz" -mtime +7 -delete
```
