<?php
/**
 * Plugin Name: Mobile OTP Authentication for WooCommerce
 * Plugin URI: https://yourcompany.com
 * Description: Add mobile number OTP authentication for Bangladesh users
 * Version: 1.0.0
 * Author: Your Company
 * Author URI: https://yourcompany.com
 * Text Domain: mobile-otp-auth
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.4
 * WC requires at least: 5.0
 * WC tested up to: 8.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Mobile_OTP_Auth {
    
    private $api_key;
    private $sender_id;
    private $api_url;

    public function __construct() {
        // Initialize settings
        $this->api_key = get_option('mobile_otp_api_key', '');
        $this->sender_id = get_option('mobile_otp_sender_id', '');
        $this->api_url = get_option('mobile_otp_api_url', 'https://api.greenweb.com.bd/api.php'); // Default to Green Web

        // Add hooks
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        
        // WooCommerce hooks
        add_action('woocommerce_register_form', array($this, 'add_mobile_field_to_registration'));
        add_action('woocommerce_created_customer', array($this, 'save_mobile_number'));
        
        // AJAX handlers
        add_action('wp_ajax_send_otp', array($this, 'send_otp'));
        add_action('wp_ajax_nopriv_send_otp', array($this, 'send_otp'));
        add_action('wp_ajax_verify_otp', array($this, 'verify_otp'));
        add_action('wp_ajax_nopriv_verify_otp', array($this, 'verify_otp'));
        
        // Enqueue scripts
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        
        // Add mobile field to checkout
        add_filter('woocommerce_checkout_fields', array($this, 'add_mobile_field_to_checkout'));
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_options_page(
            __('Mobile OTP Settings', 'mobile-otp-auth'),
            __('Mobile OTP', 'mobile-otp-auth'),
            'manage_options',
            'mobile-otp-auth',
            array($this, 'settings_page')
        );
    }

    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('mobile_otp_settings', 'mobile_otp_api_key');
        register_setting('mobile_otp_settings', 'mobile_otp_sender_id');
        register_setting('mobile_otp_settings', 'mobile_otp_api_url');
        register_setting('mobile_otp_settings', 'mobile_otp_provider');
    }

    /**
     * Settings page
     */
    public function settings_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Mobile OTP Authentication Settings', 'mobile-otp-auth'); ?></h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('mobile_otp_settings');
                do_settings_sections('mobile_otp_settings');
                ?>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="mobile_otp_provider"><?php _e('SMS Provider', 'mobile-otp-auth'); ?></label>
                        </th>
                        <td>
                            <select name="mobile_otp_provider" id="mobile_otp_provider">
                                <option value="greenweb" <?php selected(get_option('mobile_otp_provider'), 'greenweb'); ?>>Green Web BD</option>
                                <option value="sslwireless" <?php selected(get_option('mobile_otp_provider'), 'sslwireless'); ?>>SSL Wireless</option>
                                <option value="muthofun" <?php selected(get_option('mobile_otp_provider'), 'muthofun'); ?>>Muthofun</option>
                                <option value="custom" <?php selected(get_option('mobile_otp_provider'), 'custom'); ?>>Custom API</option>
                            </select>
                            <p class="description"><?php _e('Select your SMS gateway provider', 'mobile-otp-auth'); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="mobile_otp_api_key"><?php _e('API Key', 'mobile-otp-auth'); ?></label>
                        </th>
                        <td>
                            <input type="text" name="mobile_otp_api_key" id="mobile_otp_api_key" 
                                   value="<?php echo esc_attr(get_option('mobile_otp_api_key')); ?>" 
                                   class="regular-text" />
                            <p class="description"><?php _e('Enter your SMS gateway API key', 'mobile-otp-auth'); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="mobile_otp_sender_id"><?php _e('Sender ID', 'mobile-otp-auth'); ?></label>
                        </th>
                        <td>
                            <input type="text" name="mobile_otp_sender_id" id="mobile_otp_sender_id" 
                                   value="<?php echo esc_attr(get_option('mobile_otp_sender_id')); ?>" 
                                   class="regular-text" />
                            <p class="description"><?php _e('Enter your approved sender ID', 'mobile-otp-auth'); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="mobile_otp_api_url"><?php _e('API URL', 'mobile-otp-auth'); ?></label>
                        </th>
                        <td>
                            <input type="url" name="mobile_otp_api_url" id="mobile_otp_api_url" 
                                   value="<?php echo esc_attr(get_option('mobile_otp_api_url')); ?>" 
                                   class="regular-text" />
                            <p class="description"><?php _e('Enter your SMS gateway API endpoint URL', 'mobile-otp-auth'); ?></p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }

    /**
     * Add mobile field to registration
     */
    public function add_mobile_field_to_registration() {
        ?>
        <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <label for="reg_mobile"><?php _e('Mobile Number', 'mobile-otp-auth'); ?> <span class="required">*</span></label>
            <input type="tel" class="woocommerce-Input woocommerce-Input--text input-text" 
                   name="mobile_number" id="reg_mobile" value="<?php echo esc_attr(isset($_POST['mobile_number']) ? $_POST['mobile_number'] : ''); ?>" 
                   placeholder="01XXXXXXXXX" pattern="01[0-9]{9}" required />
        </p>
        <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
            <button type="button" id="send_otp_btn" class="button"><?php _e('Send OTP', 'mobile-otp-auth'); ?></button>
            <span id="otp_status"></span>
        </p>
        <p class="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide" id="otp_field" style="display:none;">
            <label for="reg_otp"><?php _e('Enter OTP', 'mobile-otp-auth'); ?> <span class="required">*</span></label>
            <input type="text" class="woocommerce-Input woocommerce-Input--text input-text" 
                   name="otp_code" id="reg_otp" maxlength="6" />
        </p>
        <?php
    }

    /**
     * Add mobile field to checkout
     */
    public function add_mobile_field_to_checkout($fields) {
        $fields['billing']['billing_phone']['priority'] = 25;
        $fields['billing']['billing_phone']['required'] = true;
        $fields['billing']['billing_phone']['placeholder'] = '01XXXXXXXXX';
        $fields['billing']['billing_phone']['class'] = array('form-row-wide');
        
        return $fields;
    }

    /**
     * Save mobile number
     */
    public function save_mobile_number($customer_id) {
        if (isset($_POST['mobile_number'])) {
            update_user_meta($customer_id, 'mobile_number', sanitize_text_field($_POST['mobile_number']));
        }
    }

    /**
     * Send OTP
     */
    public function send_otp() {
        check_ajax_referer('mobile_otp_nonce', 'nonce');

        $mobile = sanitize_text_field($_POST['mobile']);
        
        // Validate mobile number
        if (!preg_match('/^01[0-9]{9}$/', $mobile)) {
            wp_send_json_error(array('message' => __('Invalid mobile number format', 'mobile-otp-auth')));
        }

        // Generate OTP
        $otp = rand(100000, 999999);
        
        // Store OTP in transient (valid for 5 minutes)
        set_transient('mobile_otp_' . $mobile, $otp, 300);

        // Send SMS
        $message = "Your OTP is: " . $otp . ". Valid for 5 minutes. Do not share with anyone.";
        $result = $this->send_sms($mobile, $message);

        if ($result) {
            wp_send_json_success(array('message' => __('OTP sent successfully to your mobile', 'mobile-otp-auth')));
        } else {
            wp_send_json_error(array('message' => __('Failed to send OTP. Please try again.', 'mobile-otp-auth')));
        }
    }

    /**
     * Verify OTP
     */
    public function verify_otp() {
        check_ajax_referer('mobile_otp_nonce', 'nonce');

        $mobile = sanitize_text_field($_POST['mobile']);
        $otp = sanitize_text_field($_POST['otp']);

        $stored_otp = get_transient('mobile_otp_' . $mobile);

        if ($stored_otp && $stored_otp == $otp) {
            delete_transient('mobile_otp_' . $mobile);
            wp_send_json_success(array('message' => __('OTP verified successfully', 'mobile-otp-auth')));
        } else {
            wp_send_json_error(array('message' => __('Invalid or expired OTP', 'mobile-otp-auth')));
        }
    }

    /**
     * Send SMS
     */
    private function send_sms($mobile, $message) {
        $provider = get_option('mobile_otp_provider', 'greenweb');

        switch ($provider) {
            case 'greenweb':
                return $this->send_sms_greenweb($mobile, $message);
            case 'sslwireless':
                return $this->send_sms_sslwireless($mobile, $message);
            case 'muthofun':
                return $this->send_sms_muthofun($mobile, $message);
            default:
                return $this->send_sms_custom($mobile, $message);
        }
    }

    /**
     * Send SMS via Green Web
     */
    private function send_sms_greenweb($mobile, $message) {
        $url = 'https://api.greenweb.com.bd/api.php';
        
        $params = array(
            'token' => $this->api_key,
            'to' => $mobile,
            'message' => $message
        );

        $response = wp_remote_get(add_query_arg($params, $url));
        
        return !is_wp_error($response);
    }

    /**
     * Send SMS via SSL Wireless
     */
    private function send_sms_sslwireless($mobile, $message) {
        // Implement SSL Wireless API
        // Add your SSL Wireless specific implementation
        return true;
    }

    /**
     * Send SMS via Muthofun
     */
    private function send_sms_muthofun($mobile, $message) {
        // Implement Muthofun API
        // Add your Muthofun specific implementation
        return true;
    }

    /**
     * Send SMS via custom API
     */
    private function send_sms_custom($mobile, $message) {
        $response = wp_remote_post($this->api_url, array(
            'body' => array(
                'api_key' => $this->api_key,
                'mobile' => $mobile,
                'message' => $message,
                'sender_id' => $this->sender_id
            )
        ));

        return !is_wp_error($response);
    }

    /**
     * Enqueue scripts
     */
    public function enqueue_scripts() {
        if (is_account_page() || is_checkout()) {
            wp_enqueue_script('mobile-otp-auth', plugin_dir_url(__FILE__) . 'js/mobile-otp.js', array('jquery'), '1.0.0', true);
            wp_localize_script('mobile-otp-auth', 'mobileOtpAjax', array(
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('mobile_otp_nonce')
            ));
        }
    }
}

// Initialize the plugin
new Mobile_OTP_Auth();
