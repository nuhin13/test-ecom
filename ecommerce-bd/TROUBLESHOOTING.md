# 🔧 Troubleshooting Guide - E-Commerce BD

## 🚨 Common Issues & Solutions

---

## Docker & Container Issues

### Issue 1: Containers not starting

**Symptoms:**
- `docker-compose up` fails
- Containers exit immediately
- Error messages in logs

**Solutions:**

```bash
# Check Docker is running
sudo systemctl status docker

# Start Docker if stopped
sudo systemctl start docker

# Check for port conflicts
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8080

# Check logs for specific errors
docker-compose logs

# Remove and recreate containers
docker-compose down -v
docker-compose up -d
```

**Common Causes:**
- Docker daemon not running
- Port already in use (kill the process using the port)
- Incorrect .env file
- Insufficient disk space

---

### Issue 2: Permission denied errors

**Symptoms:**
- Can't write to WordPress files
- Upload fails
- Plugin installation fails

**Solutions:**

```bash
# Fix WordPress permissions
docker exec ecommerce_wordpress chown -R www-data:www-data /var/www/html

# Fix uploads directory
docker exec ecommerce_wordpress chmod -R 755 /var/www/html/wp-content/uploads

# Fix plugins directory
docker exec ecommerce_wordpress chmod -R 755 /var/www/html/wp-content/plugins

# Fix themes directory
docker exec ecommerce_wordpress chmod -R 755 /var/www/html/wp-content/themes
```

---

### Issue 3: Database connection error

**Symptoms:**
- "Error establishing database connection"
- WordPress won't load

**Solutions:**

```bash
# Check if MySQL is running
docker-compose ps

# Restart MySQL container
docker-compose restart db

# Check MySQL logs
docker-compose logs db

# Verify credentials in .env match docker-compose.yml
cat .env

# Test database connection
docker exec ecommerce_db mysql -u wordpress -p wordpress

# If all else fails, recreate database
docker-compose down
docker volume rm ecommerce-bd_db_data
docker-compose up -d
# Note: This deletes all data!
```

---

## WordPress Issues

### Issue 4: White screen / blank page

**Symptoms:**
- WordPress shows white screen
- No error message visible

**Solutions:**

```bash
# Enable debugging
# Add to wp-config.php:
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

# Check debug log
docker exec ecommerce_wordpress cat /var/www/html/wp-content/debug.log

# Increase PHP memory
# Edit uploads.ini and restart
memory_limit = 512M

# Deactivate all plugins via database
docker exec ecommerce_db mysql -u wordpress -p wordpress -e "UPDATE wp_options SET option_value = '' WHERE option_name = 'active_plugins';"
```

---

### Issue 5: Can't login to WordPress admin

**Symptoms:**
- Login page loops
- Invalid credentials error
- Locked out of admin

**Solutions:**

```bash
# Reset password via MySQL
docker exec -it ecommerce_db mysql -u wordpress -p wordpress

# In MySQL:
UPDATE wp_users SET user_pass = MD5('newpassword') WHERE user_login = 'admin';
exit;

# Clear cookies and cache in browser

# Disable plugins causing issues
docker exec ecommerce_wordpress mv /var/www/html/wp-content/plugins /var/www/html/wp-content/plugins_backup

# Add new admin user via MySQL
docker exec -it ecommerce_db mysql -u wordpress -p wordpress

# In MySQL:
INSERT INTO wp_users (user_login, user_pass, user_nicename, user_email, user_status) VALUES ('newadmin', MD5('password123'), 'newadmin', 'admin@example.com', 0);
INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES (LAST_INSERT_ID(), 'wp_capabilities', 'a:1:{s:13:"administrator";b:1;}');
INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES (LAST_INSERT_ID(), 'wp_user_level', '10');
```

---

### Issue 6: 404 errors on all pages

**Symptoms:**
- Homepage works but other pages show 404
- Product pages not found

**Solutions:**

```bash
# Reset permalinks
# Go to: Settings > Permalinks > Save Changes (no changes needed, just save)

# Or via command line:
docker exec ecommerce_wordpress wp rewrite flush --allow-root

# Check .htaccess exists and is writable
docker exec ecommerce_wordpress cat /var/www/html/.htaccess

# If missing, create it:
docker exec ecommerce_wordpress bash -c 'cat > /var/www/html/.htaccess << EOF
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
EOF'
```

---

## WooCommerce Issues

### Issue 7: Products not showing

**Symptoms:**
- Shop page empty
- Products don't appear

**Solutions:**

```bash
# Check WooCommerce database tables exist
docker exec ecommerce_db mysql -u wordpress -p wordpress -e "SHOW TABLES LIKE 'wp_woocommerce%';"

# Regenerate product data
# WordPress Admin: WooCommerce > Status > Tools
# Click "Recount terms" and "Clear transients"

# Or via CLI:
docker exec ecommerce_wordpress wp wc tool run regenerate_product_lookup_tables --allow-root

# Check product visibility
# Edit products, ensure they're published and in stock
```

---

### Issue 8: Add to cart not working

**Symptoms:**
- Button doesn't respond
- AJAX errors in console

**Solutions:**

```javascript
// Check browser console for JavaScript errors (F12)

// Clear all caching
// WooCommerce > Status > Tools > Clear transients

// Disable AJAX add to cart (temporarily)
// Add to functions.php:
add_filter( 'woocommerce_is_ajax_add_to_cart_enabled', '__return_false' );

// Check for plugin conflicts
// Deactivate plugins one by one to identify culprit
```

---

### Issue 9: Checkout not working

**Symptoms:**
- Can't proceed past checkout
- Payment errors
- Order not created

**Solutions:**

```bash
# Clear WooCommerce sessions
docker exec ecommerce_db mysql -u wordpress -p wordpress -e "TRUNCATE TABLE wp_woocommerce_sessions;"

# Check required fields are filled
# WooCommerce > Settings > Advanced > Checkout
# Verify checkout page is selected

# Test with different payment method
# Enable "Cash on Delivery" for testing

# Check shipping zones configured
# WooCommerce > Settings > Shipping

# View logs
# WooCommerce > Status > Logs
```

---

## Payment Gateway Issues

### Issue 10: SSLCommerz payment failing

**Symptoms:**
- Payment initiation fails
- Redirect doesn't happen
- "Invalid credentials" error

**Solutions:**

```bash
# Verify credentials
# WooCommerce > Settings > Payments > SSLCommerz
# Double-check Store ID and Store Password

# Check if in correct mode (test/production)
# Verify test mode ON for testing
# Test mode OFF for production

# Check SSLCommerz dashboard for errors
# Login to merchant.sslcommerz.com
# View transaction logs

# Test API connectivity
curl -X POST https://sandbox.sslcommerz.com/gwprocess/v4/api.php \
  -d "store_id=YOUR_STORE_ID&store_passwd=YOUR_STORE_PASS&total_amount=100"

# Enable WordPress debug to see API errors
# Check debug.log for SSLCommerz errors
```

---

### Issue 11: Payment success but order shows pending

**Symptoms:**
- Payment completed on SSLCommerz
- Order status stuck on "Pending Payment"

**Solutions:**

```bash
# Check IPN/webhook URL configured
# SSLCommerz Dashboard > Integration Settings
# IPN URL should be: https://yourdomain.com/?wc-api=WC_Gateway_SSLCommerz

# Check webhook logs
# WooCommerce > Status > Logs > sslcommerz

# Manually update order status if needed
# Find order, change status to "Processing"

# Verify SSL certificate valid
# Webhooks might fail with invalid SSL

# Check firewall not blocking webhook calls
```

---

## Mobile OTP Issues

### Issue 12: OTP not sending

**Symptoms:**
- No SMS received
- "Failed to send OTP" error

**Solutions:**

```bash
# Verify SMS gateway credentials
# Settings > Mobile OTP
# Check API Key, Sender ID, API URL

# Check SMS gateway balance
# Login to your SMS provider dashboard
# Verify sufficient balance

# Test API directly
curl "https://api.greenweb.com.bd/api.php?token=YOUR_TOKEN&to=01XXXXXXXXX&message=Test"

# Check mobile number format
# Should be: 01XXXXXXXXX (no spaces, no +88)

# Enable WordPress debugging
# Check for API errors in debug.log

# Try different SMS provider
# Switch between Green Web, SSL Wireless, Muthofun
```

---

### Issue 13: OTP verification failing

**Symptoms:**
- Correct OTP shows "Invalid OTP"
- OTP expired immediately

**Solutions:**

```bash
# Check transient storage working
# Test if transients being saved/retrieved
docker exec ecommerce_db mysql -u wordpress -p wordpress -e "SELECT * FROM wp_options WHERE option_name LIKE '%transient%mobile_otp%';"

# Increase OTP validity time
# Edit plugin, change transient timeout
set_transient('mobile_otp_' . $mobile, $otp, 300); // 5 minutes

# Check system time correct
date
# If wrong, sync time:
sudo ntpdate time.google.com

# Clear all transients
# WooCommerce > Status > Tools > Clear transients
```

---

## Email Issues

### Issue 14: Emails not sending

**Symptoms:**
- Order confirmation not received
- Password reset email doesn't arrive

**Solutions:**

```bash
# Install and configure WP Mail SMTP plugin
# Plugins > Add New > "WP Mail SMTP"

# Use Gmail SMTP:
# SMTP Host: smtp.gmail.com
# Encryption: TLS
# SMTP Port: 587
# SMTP Username: your@gmail.com
# SMTP Password: app-specific password

# Test email sending
# WP Mail SMTP > Email Test

# Check spam folder

# Verify FROM email address
# Settings > General > Email Address

# Check email logs
# If using logging plugin, check logs
```

---

## Performance Issues

### Issue 15: Slow website loading

**Symptoms:**
- Pages take >5 seconds to load
- Poor Google PageSpeed score

**Solutions:**

```bash
# Enable caching
# Install W3 Total Cache or WP Super Cache

# Optimize images
# Install and run Smush plugin
# Bulk optimize all images

# Enable Gzip compression (already in nginx.conf)

# Minify CSS/JS
# Install Autoptimize plugin

# Use CDN (optional)
# Cloudflare free plan

# Increase PHP memory
# Edit uploads.ini:
memory_limit = 512M

# Check for slow queries
# Install Query Monitor plugin

# Disable unnecessary plugins
# Keep only essential plugins active

# Optimize database
# Install WP-Optimize plugin
```

---

### Issue 16: High memory usage

**Symptoms:**
- WordPress runs out of memory
- Fatal error: memory limit exceeded

**Solutions:**

```bash
# Increase PHP memory limit
# Edit uploads.ini:
memory_limit = 512M

# Restart WordPress container
docker-compose restart wordpress

# Check what's using memory
# Install Query Monitor plugin

# Optimize images to reduce memory
# Large images use more memory

# Limit post revisions
# Add to wp-config.php:
define('WP_POST_REVISIONS', 3);

# Disable plugins temporarily
# Identify memory-hungry plugins
```

---

## SSL Certificate Issues

### Issue 17: SSL certificate errors

**Symptoms:**
- "Not secure" warning in browser
- Mixed content warnings
- SSL certificate invalid

**Solutions:**

```bash
# Verify certificate files exist
ls -la nginx/ssl/

# Check certificate validity
openssl x509 -in nginx/ssl/fullchain.pem -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew

# Fix mixed content
# Install Really Simple SSL plugin
# It will automatically fix HTTP URLs to HTTPS

# Update WordPress URLs
# Settings > General
# WordPress Address: https://yourdomain.com
# Site Address: https://yourdomain.com

# Update database URLs
docker exec ecommerce_wordpress wp search-replace 'http://yourdomain.com' 'https://yourdomain.com' --allow-root
```

---

## Image Upload Issues

### Issue 18: Can't upload images

**Symptoms:**
- "Failed to upload" error
- File size limit exceeded
- No permission to upload

**Solutions:**

```bash
# Check upload directory permissions
docker exec ecommerce_wordpress ls -la /var/www/html/wp-content/uploads

# Fix permissions
docker exec ecommerce_wordpress chown -R www-data:www-data /var/www/html/wp-content/uploads
docker exec ecommerce_wordpress chmod -R 755 /var/www/html/wp-content/uploads

# Increase upload limits
# Edit uploads.ini:
upload_max_filesize = 64M
post_max_size = 64M

# Restart container
docker-compose restart wordpress

# Check disk space
df -h

# Verify uploads.ini is loaded
docker exec ecommerce_wordpress php -i | grep upload_max_filesize
```

---

## Plugin/Theme Issues

### Issue 19: Plugin installation failed

**Symptoms:**
- Can't install plugin
- Download failed
- Unpacking failed

**Solutions:**

```bash
# Check write permissions
docker exec ecommerce_wordpress chmod -R 755 /var/www/html/wp-content/plugins

# Increase timeout
# Edit wp-config.php:
define('FS_TIMEOUT', 300);

# Check disk space
docker exec ecommerce_wordpress df -h

# Install manually via upload
# Download plugin ZIP
# Upload via WordPress Admin > Plugins > Add New > Upload

# Or copy directly:
docker cp plugin-folder ecommerce_wordpress:/var/www/html/wp-content/plugins/
```

---

### Issue 20: Theme causing errors

**Symptoms:**
- Website broken after theme activation
- Fatal PHP errors

**Solutions:**

```bash
# Switch to default theme via database
docker exec ecommerce_db mysql -u wordpress -p wordpress

# In MySQL:
UPDATE wp_options SET option_value = 'twentytwentyfour' WHERE option_name = 'template';
UPDATE wp_options SET option_value = 'twentytwentyfour' WHERE option_name = 'stylesheet';
exit;

# Or rename theme folder
docker exec ecommerce_wordpress mv /var/www/html/wp-content/themes/problematic-theme /var/www/html/wp-content/themes/problematic-theme-backup

# Check PHP version compatibility
# Some themes require specific PHP versions
```

---

## Backup & Recovery

### Issue 21: Need to restore from backup

**Process:**

```bash
# Stop containers
docker-compose down

# Restore database
docker-compose up -d db
docker exec -i ecommerce_db mysql -u wordpress -p wordpress < backup.sql

# Restore WordPress files
tar -xzf wordpress_backup.tar.gz
docker cp wordpress_data/. ecommerce_wordpress:/var/www/html/

# Start all containers
docker-compose up -d

# Clear cache
docker exec ecommerce_wordpress wp cache flush --allow-root

# Regenerate permalinks
docker exec ecommerce_wordpress wp rewrite flush --allow-root
```

---

## Emergency Recovery

### Issue 22: Complete system failure

**When all else fails:**

```bash
# 1. Backup current state (if possible)
docker exec ecommerce_db mysqldump -u wordpress -p wordpress > emergency_backup.sql
tar -czf wordpress_emergency.tar.gz wordpress_data/

# 2. Complete reset
docker-compose down -v

# 3. Clean start
./setup.sh

# 4. Restore from backup
# Follow Issue 21 steps

# 5. Reinstall plugins
# Install all essential plugins again

# 6. Reconfigure settings
# Follow QUICK-START-CHECKLIST.md

# 7. Test everything
# Complete checkout flow
# Test payments
# Verify emails
```

---

## 🔍 Debugging Tools

### Enable WordPress Debugging

Add to `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);
define('SAVEQUERIES', true);
```

### Useful Commands

```bash
# View real-time logs
docker-compose logs -f

# View specific container logs
docker-compose logs wordpress
docker-compose logs db
docker-compose logs nginx

# Check container resource usage
docker stats

# Access WordPress CLI
docker exec ecommerce_wordpress wp --info --allow-root

# Access MySQL CLI
docker exec -it ecommerce_db mysql -u wordpress -p

# Check PHP configuration
docker exec ecommerce_wordpress php -i

# List all WordPress files
docker exec ecommerce_wordpress find /var/www/html -type f

# Check file permissions
docker exec ecommerce_wordpress ls -la /var/www/html/wp-content/
```

---

## 📞 Getting Help

### Check These First
1. ✅ README.md - Complete documentation
2. ✅ QUICK-START-CHECKLIST.md - Step-by-step guide
3. ✅ WordPress debug.log - Error details
4. ✅ Docker logs - Container errors
5. ✅ Browser console - JavaScript errors

### Online Resources
- WordPress Support: https://wordpress.org/support/
- WooCommerce Docs: https://woocommerce.com/documentation/
- Docker Docs: https://docs.docker.com/
- SSLCommerz Support: https://developer.sslcommerz.com/
- Stack Overflow: https://stackoverflow.com/

### Community Forums
- WordPress Bangladesh: Facebook groups
- WooCommerce Community: woocommerce.com/community/
- Docker Community: forums.docker.com

---

## 💡 Prevention Tips

1. **Regular Backups**: Daily automated backups
2. **Keep Updated**: Update WordPress, plugins, themes
3. **Monitor Logs**: Check logs weekly
4. **Test Before Live**: Use staging for major changes
5. **Use Staging**: Clone site for testing
6. **Strong Passwords**: Use complex passwords
7. **Limit Plugins**: Only install necessary plugins
8. **Monitor Performance**: Use monitoring tools
9. **Security Scans**: Run regular security scans
10. **Documentation**: Document all changes

---

## ✅ Health Check Routine

### Daily
- [ ] Check if website loads
- [ ] Verify orders processing
- [ ] Check payment gateway working
- [ ] Monitor error logs

### Weekly
- [ ] Review analytics
- [ ] Check backup status
- [ ] Update plugins if needed
- [ ] Review security logs
- [ ] Test checkout flow

### Monthly
- [ ] Full backup verification
- [ ] Performance audit
- [ ] Security audit
- [ ] Plugin cleanup
- [ ] Database optimization

---

**Remember**: Most issues can be resolved by:
1. Checking logs (`docker-compose logs`)
2. Restarting containers (`docker-compose restart`)
3. Clearing cache
4. Verifying credentials
5. Checking file permissions

---

**Still stuck?** Document your issue with:
- Exact error message
- Steps to reproduce
- What you've already tried
- Relevant log entries

Then seek help from the WordPress/WooCommerce community!
