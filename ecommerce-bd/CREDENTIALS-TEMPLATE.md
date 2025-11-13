# 🔑 Access Information & Credentials

## 🌐 Access URLs

### Development Environment
```
Main Website: http://localhost:8080
Direct Access: http://localhost
Database Admin: http://localhost:8081
```

### Production Environment (After deployment)
```
Main Website: https://yourdomain.com
Admin Panel: https://yourdomain.com/wp-admin
Database Admin: https://yourdomain.com:8081
```

---

## 🔐 Default Credentials

### WordPress Admin
```
URL: http://localhost:8080/wp-admin
Username: [Set during installation]
Password: [Set during installation]
Email: [Set during installation]
```

### phpMyAdmin
```
URL: http://localhost:8081
Server: db
Username: wordpress (or root for admin)
Password: [From .env file]
```

### MySQL Database (Command Line)
```
Host: localhost (or db inside container)
Port: 3306
Database: wordpress
Username: wordpress
Password: [From .env file]
Root Password: [From .env file]

# Access command:
docker exec -it ecommerce_db mysql -u wordpress -p
```

---

## 🔑 Service Credentials to Obtain

### SSLCommerz Payment Gateway
```
Merchant Account: https://merchant.sslcommerz.com/
Registration: https://sslcommerz.com/registration/

After Registration:
□ Store ID: _____________________
□ Store Password: _____________________
□ Test Store ID: _____________________
□ Test Store Password: _____________________

Configuration Location: WooCommerce > Settings > Payments > SSLCommerz
```

### SMS Gateway (Choose One)

#### Option 1: Green Web BD
```
Website: https://greenweb.com.bd
Registration: https://greenweb.com.bd/register

After Registration:
□ API Key: _____________________
□ Sender ID: _____________________
□ API URL: https://api.greenweb.com.bd/api.php

Configuration Location: Settings > Mobile OTP
```

#### Option 2: SSL Wireless
```
Website: https://sslwireless.com
Contact: sales@sslwireless.com

After Setup:
□ API Key: _____________________
□ Sender ID: _____________________
□ API URL: _____________________

Configuration Location: Settings > Mobile OTP
```

#### Option 3: Muthofun
```
Website: https://muthofun.com
Contact: support@muthofun.com

After Setup:
□ API Key: _____________________
□ Sender ID: _____________________
□ API URL: _____________________

Configuration Location: Settings > Mobile OTP
```

---

## 🌐 Domain & Hosting

### Domain Registration
```
Registrar: _____________________
Domain Name: _____________________
Registration Date: _____________________
Expiry Date: _____________________
Renewal Cost: _____________________

Login URL: _____________________
Username: _____________________
Password: _____________________
```

### Hosting / VPS
```
Provider: _____________________
Server IP: _____________________
Server Location: _____________________
Plan: _____________________
Monthly Cost: _____________________

Control Panel: _____________________
Username: _____________________
Password: _____________________
```

### SSL Certificate
```
Type: Let's Encrypt (Free) / Paid
Provider: _____________________
Expiry Date: _____________________
Auto-Renewal: □ Yes □ No

Certificate Locations:
fullchain.pem: /etc/letsencrypt/live/yourdomain.com/fullchain.pem
privkey.pem: /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

---

## 📧 Email Services

### SMTP Configuration (for reliable email delivery)

#### Option 1: Gmail SMTP
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
Encryption: TLS
Username: your-email@gmail.com
Password: [App-specific password]

How to get app password:
1. Enable 2FA on Gmail
2. Go to: https://myaccount.google.com/apppasswords
3. Generate new app password
4. Use in WP Mail SMTP plugin
```

#### Option 2: SendGrid
```
Website: https://sendgrid.com
Free Tier: 100 emails/day

SMTP Host: smtp.sendgrid.net
SMTP Port: 587
Username: apikey
Password: [Your API Key]

Configuration Location: Plugins > WP Mail SMTP
```

#### Option 3: Mailgun
```
Website: https://mailgun.com
Free Tier: 5,000 emails/month

SMTP Host: smtp.mailgun.org
SMTP Port: 587
Username: [From Mailgun]
Password: [From Mailgun]

Configuration Location: Plugins > WP Mail SMTP
```

---

## 📊 Analytics & Tracking

### Google Analytics
```
Website: https://analytics.google.com
Account: _____________________
Property: _____________________
Tracking ID: UA-XXXXXXXXX-X
OR
Measurement ID: G-XXXXXXXXXX

Configuration Location: Plugins > MonsterInsights
```

### Google Search Console
```
Website: https://search.google.com/search-console
Property URL: _____________________
Verification Method: HTML Tag / File / DNS

Sitemap URL: https://yourdomain.com/sitemap_index.xml
Configuration Location: Yoast SEO > General > Features
```

### Facebook Pixel
```
Website: https://business.facebook.com
Pixel ID: _____________________
Access Token: _____________________

Configuration Location: Plugins > PixelYourSite
```

---

## 🗄️ Backup Storage

### Google Drive
```
Account: _____________________
Folder: WordPress Backups
Sharing: Private

Configuration Location: UpdraftPlus > Settings > Google Drive
```

### Dropbox
```
Account: _____________________
App: UpdraftPlus
Folder: /Apps/UpdraftPlus

Configuration Location: UpdraftPlus > Settings > Dropbox
```

---

## 🔒 Security Services

### Cloudflare (Optional CDN)
```
Website: https://cloudflare.com
Account: _____________________
DNS: Managed by Cloudflare
SSL: Flexible / Full / Full (Strict)

Configuration:
1. Add site to Cloudflare
2. Update domain nameservers
3. Enable SSL
4. Configure caching
```

### Wordfence
```
Account: https://www.wordfence.com
License Key: _____________________
License Type: Free / Premium

Configuration Location: Wordfence > Dashboard
```

---

## 🎨 Design & Branding

### Logo & Assets
```
Logo File: _____________________
Favicon: _____________________
Brand Colors:
  - Primary: #______
  - Secondary: #______
  - Accent: #______

Font:
  - Primary: _____________________
  - Secondary: _____________________
```

### Social Media
```
Facebook: https://facebook.com/___________
Instagram: https://instagram.com/___________
Twitter: https://twitter.com/___________
LinkedIn: https://linkedin.com/company/___________

Admin Access:
Username: _____________________
Password: _____________________
```

---

## 📞 Support Contacts

### Technical Support
```
Web Developer: _____________________
Phone: _____________________
Email: _____________________
Available: _____________________
```

### Business Contacts
```
SSLCommerz Support:
  Phone: +880-XXXXXXXXXX
  Email: support@sslcommerz.com
  Merchant Portal: https://merchant.sslcommerz.com

SMS Gateway Support:
  Provider: _____________________
  Phone: _____________________
  Email: _____________________

Hosting Support:
  Provider: _____________________
  Phone: _____________________
  Email: _____________________
  Support Portal: _____________________
```

---

## 🔐 Emergency Access

### In Case of Emergency

**If locked out of WordPress:**
```bash
# Reset admin password
docker exec -it ecommerce_db mysql -u wordpress -p wordpress
UPDATE wp_users SET user_pass = MD5('newpassword') WHERE user_login = 'admin';
```

**If website down:**
```bash
# Restart all services
cd /home/claude/ecommerce-bd
docker-compose restart

# Check logs
docker-compose logs -f
```

**If database corrupted:**
```bash
# Restore from latest backup
docker exec -i ecommerce_db mysql -u wordpress -p wordpress < backup.sql
```

**Emergency Contacts:**
1. _____________________
2. _____________________
3. _____________________

---

## 📝 Important Notes

### Security Best Practices
- ✅ Use strong, unique passwords
- ✅ Enable two-factor authentication
- ✅ Keep all credentials in a secure password manager
- ✅ Never share credentials via email
- ✅ Change passwords every 3 months
- ✅ Use different passwords for each service
- ✅ Keep this document secure (encrypt or password protect)

### Backup Schedule
- Daily: Automated database backup
- Weekly: Full WordPress files backup
- Monthly: Download backups to local storage
- Quarterly: Test restore process

### Renewal Reminders
- Domain renewal: _____________________
- SSL certificate renewal: _____________________
- Hosting renewal: _____________________
- Premium plugins: _____________________

---

## ✅ Setup Completion Checklist

□ WordPress installed with admin account
□ WooCommerce configured
□ SSLCommerz credentials obtained and configured
□ SMS gateway account created and configured
□ Domain registered (if production)
□ SSL certificate installed (if production)
□ Email SMTP configured
□ Google Analytics setup
□ Backup system configured
□ All passwords documented securely
□ Emergency contacts saved
□ Social media accounts created
□ Logo and branding assets uploaded

---

## 📱 Mobile App Credentials (Future)

When you build mobile apps:
```
API Base URL: https://yourdomain.com/wp-json/wc/v3/
Consumer Key: ck_________________________________
Consumer Secret: cs_________________________________

How to generate:
WooCommerce > Settings > Advanced > REST API > Add Key
```

---

## 🎯 API Keys & Integrations

### WooCommerce REST API
```
URL: https://yourdomain.com/wp-json/wc/v3/
Consumer Key: _____________________
Consumer Secret: _____________________

Configuration Location: WooCommerce > Settings > Advanced > REST API
```

### Other Integrations
```
Service: _____________________
API Key: _____________________
Secret: _____________________
Webhook URL: _____________________
```

---

**⚠️ IMPORTANT: Keep this document secure!**

- Store in password manager (1Password, LastPass, Bitwarden)
- Encrypt if storing locally
- Never commit to public repositories
- Share only with trusted team members
- Update regularly when credentials change

---

**Date Created:** _____________________
**Last Updated:** _____________________
**Maintained By:** _____________________

---

Good luck with your e-commerce business! 🚀
