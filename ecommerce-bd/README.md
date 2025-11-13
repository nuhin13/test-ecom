# 🛍️ E-Commerce BD - Complete WordPress + WooCommerce Platform

A complete e-commerce solution for Bangladesh market with Docker, SSLCommerz payment gateway, and mobile OTP authentication.

## 🎯 Features

### Core E-Commerce Features
- ✅ **Product Management**: Category-wise products with detailed pages
- ✅ **Shopping Cart**: Add to cart, update quantities, checkout
- ✅ **User Authentication**: Email & Mobile number login with OTP verification
- ✅ **Payment Gateway**: SSLCommerz integration for BD market
- ✅ **Search Functionality**: Product search with filters
- ✅ **SEO Optimized**: WordPress SEO best practices
- ✅ **Mobile Responsive**: Mobile-first design
- ✅ **Admin Dashboard**: Complete WooCommerce admin panel
- ✅ **Order Management**: Track orders, manage inventory
- ✅ **Customer Management**: Customer accounts, order history
- ✅ **FAQ Section**: Customer support pages
- ✅ **Email Notifications**: Order confirmations, shipping updates

### Bangladesh-Specific Features
- 🇧🇩 **SSLCommerz Payment**: Leading payment gateway in Bangladesh
- 📱 **Mobile OTP Auth**: SMS-based authentication
- 💳 **Local Payment Methods**: bKash, Rocket, Nagad support (via SSLCommerz)
- 🌐 **Bengali Language**: RTL support ready
- 📍 **BD Shipping Zones**: Dhaka, Chittagong, other divisions

## 📋 Prerequisites

- Docker & Docker Compose installed
- Domain name (optional, can use localhost)
- SSLCommerz account (get from https://sslcommerz.com)
- SMS Gateway account (Green Web, SSL Wireless, or Muthofun)

## 🚀 Quick Start (5 Steps)

### Step 1: Clone/Download the Project
```bash
cd /home/claude/ecommerce-bd
```

### Step 2: Configure Environment Variables
```bash
# Edit .env file
nano .env
```

Update these values:
```env
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_PASSWORD=your_secure_wordpress_password
DOMAIN_NAME=yourdomain.com  # or localhost
```

### Step 3: Start Docker Containers
```bash
# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

Wait for ~30 seconds for all services to start.

### Step 4: Install WordPress
1. Open browser: http://localhost:8080
2. Select language: English (or বাংলা)
3. Fill in:
   - Site Title: Your Store Name
   - Username: admin (or your choice)
   - Password: (strong password)
   - Email: your@email.com
4. Click "Install WordPress"

### Step 5: Install & Configure WooCommerce
1. Login to WordPress Admin
2. Install WooCommerce plugin
3. Follow WooCommerce setup wizard
4. Install custom plugins (detailed below)

## 📦 Detailed Installation Guide

### A. WordPress Initial Setup

1. **Access WordPress**
   - URL: http://localhost:8080
   - Follow 5-minute installation

2. **Basic Settings**
   ```
   Settings > General:
   - Site Title: Your E-Commerce Store
   - Tagline: Your business tagline
   - WordPress Address: http://localhost:8080
   - Site Address: http://localhost:8080
   - Time Zone: Asia/Dhaka
   ```

3. **Permalink Settings**
   ```
   Settings > Permalinks:
   - Select: Post name
   - Save Changes
   ```

### B. WooCommerce Installation

1. **Install WooCommerce**
   ```
   Plugins > Add New
   Search: "WooCommerce"
   Install & Activate
   ```

2. **WooCommerce Setup Wizard**
   - **Store Details**:
     - Address: Your BD address
     - Country: Bangladesh
     - Currency: BDT (৳)
   
   - **Industry**: Select your industry
   
   - **Product Types**: 
     - Physical products ✓
     - Downloads (if needed)
   
   - **Business Details**:
     - Skip or fill as needed
   
   - **Theme**:
     - Use current theme or select WooCommerce theme

3. **WooCommerce Settings**
   ```
   WooCommerce > Settings:
   
   General:
   - Store Address: Complete
   - Currency: BDT (৳)
   - Currency Position: Left with space
   
   Products:
   - Shop page: Select/create
   - Inventory: Enable stock management
   
   Shipping:
   - Shipping zones: Add Bangladesh zones
   - Dhaka: Flat rate ৳60
   - Outside Dhaka: Flat rate ৳120
   
   Payments:
   - Cash on Delivery: Enable
   - SSLCommerz: Configure (next section)
   ```

### C. Install Custom Plugins

#### 1. SSLCommerz Payment Gateway

```bash
# Copy plugin to WordPress
docker cp custom-plugins/sslcommerz-for-woocommerce ecommerce_wordpress:/var/www/html/wp-content/plugins/
```

Or manually:
1. Go to WordPress Admin
2. Plugins > Add New > Upload Plugin
3. Upload `sslcommerz-for-woocommerce` folder as ZIP
4. Activate plugin

**Configure SSLCommerz:**
```
WooCommerce > Settings > Payments > SSLCommerz:
- Enable: ✓
- Title: Credit/Debit Card or Mobile Banking
- Test Mode: ✓ (for testing)
- Store ID: Your SSLCommerz Store ID
- Store Password: Your SSLCommerz Store Password
- Save Changes
```

Get SSLCommerz credentials:
- Visit: https://sslcommerz.com
- Sign up for merchant account
- Get Store ID & Password from dashboard

#### 2. Mobile OTP Authentication

```bash
# Copy plugin to WordPress
docker cp custom-plugins/mobile-otp-auth ecommerce_wordpress:/var/www/html/wp-content/plugins/
```

Or upload via WordPress Admin.

**Configure Mobile OTP:**
```
Settings > Mobile OTP:
- SMS Provider: Green Web BD (or your choice)
- API Key: Your SMS gateway API key
- Sender ID: Your approved sender ID
- API URL: https://api.greenweb.com.bd/api.php
- Save Changes
```

Get SMS Gateway credentials:
- **Green Web**: https://greenweb.com.bd
- **SSL Wireless**: https://sslwireless.com
- **Muthofun**: https://muthofun.com

### D. Essential Plugins Installation

Install these from WordPress Admin > Plugins > Add New:

1. **Yoast SEO** - For SEO optimization
   ```
   After install:
   - Run configuration wizard
   - Set focus keywords for products
   - Generate XML sitemap
   ```

2. **Really Simple SSL** - For HTTPS (when ready)
   ```
   Activate when you have SSL certificate
   ```

3. **Smush** - Image optimization
   ```
   Optimize product images automatically
   ```

4. **Contact Form 7** - For contact/FAQ pages
   ```
   Create contact form
   Add to Contact/FAQ page
   ```

5. **WooCommerce PDF Invoices** - Invoice generation
   ```
   WooCommerce > PDF Invoices
   Configure template
   ```

### E. Theme Setup & Customization

1. **Install Theme**
   - Option 1: Use default WooCommerce theme (Storefront)
   - Option 2: Install premium theme (Flatsome, Astra, etc.)

2. **Customize Appearance**
   ```
   Appearance > Customize:
   - Site Identity: Logo, favicon
   - Colors: Brand colors
   - Typography: Fonts
   - Homepage: Set as static page
   - Menus: Create main menu
   - Widgets: Add footer widgets
   ```

3. **Create Essential Pages**
   ```
   Pages > Add New:
   - Home (with featured products)
   - Shop (auto-created by WooCommerce)
   - About Us
   - Contact Us
   - FAQ
   - Privacy Policy
   - Terms & Conditions
   - Shipping & Returns
   ```

### F. Add Products

1. **Create Categories**
   ```
   Products > Categories:
   - Electronics
   - Fashion
   - Home & Living
   - etc.
   ```

2. **Add Product**
   ```
   Products > Add New:
   - Product Name
   - Description
   - Short Description
   - Product Data:
     - Regular Price: ৳1,999
     - Sale Price: ৳1,599 (if on sale)
     - Inventory: Stock quantity
     - Shipping: Weight, dimensions
   - Product Categories: Select
   - Product Tags: Add tags
   - Product Image: Upload main image
   - Product Gallery: Upload multiple images
   - Publish
   ```

3. **Bulk Import Products**
   ```
   Products > Import:
   - Download sample CSV
   - Fill with your products
   - Upload and import
   ```

### G. SEO Optimization

1. **Yoast SEO Settings**
   ```
   SEO > General:
   - Webmaster Tools: Verify site
   
   SEO > Search Appearance:
   - Products: Optimize meta
   - Categories: Optimize
   ```

2. **Optimize Each Product**
   ```
   Edit Product:
   - Focus Keyword: Main product keyword
   - SEO Title: Optimized title
   - Meta Description: Compelling description
   - Slug: Clean URL slug
   ```

3. **Create XML Sitemap**
   ```
   SEO > General > Features:
   - XML Sitemaps: Enable
   - Submit to Google Search Console
   ```

### H. Configure Shipping

1. **Shipping Zones**
   ```
   WooCommerce > Settings > Shipping:
   
   Zone 1: Dhaka
   - Flat Rate: ৳60
   - Free Shipping: Orders over ৳2,000
   
   Zone 2: Major Cities (Chittagong, Sylhet, etc.)
   - Flat Rate: ৳100
   
   Zone 3: Rest of Bangladesh
   - Flat Rate: ৳120
   ```

2. **Shipping Classes** (optional)
   ```
   For different product types:
   - Light Items
   - Heavy Items
   - Fragile Items
   ```

### I. Payment Gateway Testing

1. **Test SSLCommerz**
   ```
   - Enable Test Mode
   - Use test cards from SSLCommerz docs
   - Complete test order
   - Verify payment success
   - Check order status
   ```

2. **Test Cash on Delivery**
   ```
   - Enable COD
   - Set COD fee (optional)
   - Complete test order
   ```

### J. Email Configuration

1. **WooCommerce Emails**
   ```
   WooCommerce > Settings > Emails:
   - Configure each email template
   - Test emails
   ```

2. **SMTP Setup** (recommended)
   ```
   Install WP Mail SMTP plugin:
   - Use Gmail, SendGrid, or Mailgun
   - Configure credentials
   - Send test email
   ```

### K. Security & Performance

1. **Security Plugins**
   ```
   Install:
   - Wordfence Security
   - iThemes Security
   
   Configure:
   - Two-factor authentication
   - Firewall rules
   - Login attempts limit
   ```

2. **Caching**
   ```
   Install:
   - W3 Total Cache or WP Super Cache
   
   Configure:
   - Page caching
   - Browser caching
   - Object caching
   ```

3. **Backup**
   ```
   Install:
   - UpdraftPlus
   
   Configure:
   - Auto backups daily
   - Store in cloud (Google Drive, Dropbox)
   ```

## 🔧 Docker Management

### Basic Commands
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose stop

# Restart containers
docker-compose restart

# View logs
docker-compose logs -f

# Stop and remove containers
docker-compose down

# Remove with volumes (⚠️ deletes data)
docker-compose down -v

# Access WordPress container
docker exec -it ecommerce_wordpress bash

# Access MySQL container
docker exec -it ecommerce_db mysql -u root -p

# Backup database
docker exec ecommerce_db mysqldump -u root -p wordpress > backup.sql

# Restore database
docker exec -i ecommerce_db mysql -u root -p wordpress < backup.sql
```

### Useful Docker Commands
```bash
# Check container status
docker-compose ps

# Check resource usage
docker stats

# View WordPress logs
docker-compose logs wordpress

# View MySQL logs
docker-compose logs db

# Update containers
docker-compose pull
docker-compose up -d
```

## 🌐 Production Deployment

### 1. Get Domain & SSL

1. **Register Domain**
   - Use any domain registrar
   - Point A record to your server IP

2. **Get SSL Certificate**
   ```bash
   # Install Certbot
   sudo apt install certbot
   
   # Get certificate
   sudo certbot certonly --webroot -w /path/to/wordpress -d yourdomain.com -d www.yourdomain.com
   
   # Copy certificates to nginx/ssl/
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
   ```

3. **Enable SSL in Nginx**
   - Edit `nginx/nginx.conf`
   - Uncomment SSL lines
   - Update domain name
   - Restart: `docker-compose restart nginx`

### 2. Update WordPress URLs

```
WordPress Admin > Settings > General:
- WordPress Address: https://yourdomain.com
- Site Address: https://yourdomain.com
```

### 3. Enable Production Mode

```bash
# Update .env
WORDPRESS_DEBUG=false
SSL_ENABLED=true
DOMAIN_NAME=yourdomain.com
SITE_URL=https://yourdomain.com

# Restart containers
docker-compose down
docker-compose up -d
```

### 4. Configure SSLCommerz Production

```
WooCommerce > Settings > Payments > SSLCommerz:
- Test Mode: ✗ (disable)
- Store ID: Production Store ID
- Store Password: Production Password
```

### 5. Final Checks

- ✅ Test complete checkout flow
- ✅ Test SSLCommerz payment
- ✅ Test mobile OTP
- ✅ Verify SSL certificate
- ✅ Check all pages load properly
- ✅ Test contact forms
- ✅ Verify emails are sending
- ✅ Check mobile responsiveness
- ✅ Test search functionality
- ✅ Verify SEO settings

## 📊 Analytics & Tracking

### Google Analytics
```
1. Create GA4 property
2. Install "GA Google Analytics" plugin
3. Enter tracking ID
4. Enable e-commerce tracking
```

### Facebook Pixel
```
1. Create Facebook Pixel
2. Install "PixelYourSite" plugin
3. Enter Pixel ID
4. Enable e-commerce events
```

## 🆘 Troubleshooting

### Issue: Can't access WordPress
```bash
# Check containers are running
docker-compose ps

# Check logs
docker-compose logs wordpress

# Restart containers
docker-compose restart
```

### Issue: Database connection error
```bash
# Check MySQL is running
docker-compose ps db

# Verify credentials in .env
cat .env

# Restart database
docker-compose restart db
```

### Issue: Images not uploading
```bash
# Check uploads directory permissions
docker exec ecommerce_wordpress ls -la /var/www/html/wp-content/uploads

# Fix permissions
docker exec ecommerce_wordpress chown -R www-data:www-data /var/www/html/wp-content/uploads
```

### Issue: OTP not sending
```
1. Check SMS gateway credentials
2. Verify API endpoint
3. Check mobile number format (01XXXXXXXXX)
4. Test API directly
5. Check SMS provider balance
```

### Issue: Payment failing
```
1. Verify SSLCommerz credentials
2. Check if test/production mode matches
3. Review WooCommerce logs
4. Contact SSLCommerz support
```

## 📱 Mobile App (Future)

Consider building mobile apps:
- **React Native** for iOS/Android
- Use WooCommerce REST API
- Integrate SSLCommerz SDK
- Add push notifications

## 🔐 Security Best Practices

1. **Strong Passwords**: Use complex passwords
2. **Two-Factor Auth**: Enable for admin accounts
3. **Regular Updates**: Keep WordPress/plugins updated
4. **SSL Certificate**: Always use HTTPS
5. **Backup Regularly**: Daily automated backups
6. **Limit Login Attempts**: Use security plugins
7. **Hide WordPress Version**: Remove version numbers
8. **Disable File Editing**: Add to wp-config.php
9. **Use Security Headers**: Configure in nginx
10. **Monitor Logs**: Check for suspicious activity

## 📈 Marketing & Growth

1. **Email Marketing**
   - Install Mailchimp plugin
   - Collect emails at checkout
   - Send newsletters

2. **Social Media**
   - Share products automatically
   - Run Facebook/Instagram ads
   - Use influencer marketing

3. **SEO**
   - Optimize product descriptions
   - Build backlinks
   - Create blog content

4. **Promotions**
   - Coupon codes
   - Flash sales
   - Seasonal discounts

## 🎓 Learning Resources

- **WooCommerce Docs**: https://woocommerce.com/documentation/
- **WordPress Codex**: https://codex.wordpress.org/
- **SSLCommerz Docs**: https://developer.sslcommerz.com/
- **Docker Docs**: https://docs.docker.com/

## 📞 Support

For issues:
1. Check troubleshooting section
2. Review WooCommerce forums
3. Contact SSLCommerz support
4. Consult WordPress community

## 📄 License

This project setup is open for your use.

## 🎉 Success Checklist

Before going live:
- [ ] WordPress installed and configured
- [ ] WooCommerce setup complete
- [ ] SSLCommerz payment working
- [ ] Mobile OTP authentication working
- [ ] Products added with images
- [ ] Categories organized
- [ ] Shipping zones configured
- [ ] Email notifications tested
- [ ] SEO settings optimized
- [ ] SSL certificate installed
- [ ] Contact/FAQ pages created
- [ ] Legal pages (Privacy, Terms) added
- [ ] Mobile responsive tested
- [ ] Test orders completed
- [ ] Analytics tracking setup
- [ ] Backup system configured
- [ ] Security plugins installed

---

**Good luck with your e-commerce business in Bangladesh! 🚀**

For questions or improvements, feel free to customize this setup according to your needs.
