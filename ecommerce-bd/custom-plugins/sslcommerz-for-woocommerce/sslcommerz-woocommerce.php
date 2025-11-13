<?php
/**
 * Plugin Name: SSLCommerz Payment Gateway for WooCommerce
 * Plugin URI: https://sslcommerz.com
 * Description: Accept payments via SSLCommerz payment gateway in Bangladesh
 * Version: 1.0.0
 * Author: Your Company
 * Author URI: https://yourcompany.com
 * Text Domain: sslcommerz-woocommerce
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.4
 * WC requires at least: 5.0
 * WC tested up to: 8.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Check if WooCommerce is active
if (!in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))) {
    return;
}

/**
 * Add the gateway to WooCommerce
 */
function add_sslcommerz_gateway_class($methods) {
    $methods[] = 'WC_Gateway_SSLCommerz';
    return $methods;
}
add_filter('woocommerce_payment_gateways', 'add_sslcommerz_gateway_class');

/**
 * SSLCommerz Payment Gateway Class
 */
function init_sslcommerz_gateway_class() {
    
    class WC_Gateway_SSLCommerz extends WC_Payment_Gateway {
        
        /**
         * Constructor
         */
        public function __construct() {
            $this->id = 'sslcommerz';
            $this->icon = '';
            $this->has_fields = false;
            $this->method_title = __('SSLCommerz', 'sslcommerz-woocommerce');
            $this->method_description = __('Accept payments via SSLCommerz Payment Gateway', 'sslcommerz-woocommerce');

            // Load the settings
            $this->init_form_fields();
            $this->init_settings();

            // Define user set variables
            $this->title = $this->get_option('title');
            $this->description = $this->get_option('description');
            $this->store_id = $this->get_option('store_id');
            $this->store_password = $this->get_option('store_password');
            $this->testmode = 'yes' === $this->get_option('testmode');

            // Actions
            add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
            add_action('woocommerce_api_wc_gateway_sslcommerz', array($this, 'webhook'));
        }

        /**
         * Initialize Gateway Settings Form Fields
         */
        public function init_form_fields() {
            $this->form_fields = array(
                'enabled' => array(
                    'title' => __('Enable/Disable', 'sslcommerz-woocommerce'),
                    'type' => 'checkbox',
                    'label' => __('Enable SSLCommerz Payment', 'sslcommerz-woocommerce'),
                    'default' => 'yes'
                ),
                'title' => array(
                    'title' => __('Title', 'sslcommerz-woocommerce'),
                    'type' => 'text',
                    'description' => __('This controls the title which the user sees during checkout.', 'sslcommerz-woocommerce'),
                    'default' => __('Credit Card / Debit Card / Mobile Banking', 'sslcommerz-woocommerce'),
                    'desc_tip' => true,
                ),
                'description' => array(
                    'title' => __('Description', 'sslcommerz-woocommerce'),
                    'type' => 'textarea',
                    'description' => __('Payment method description that the customer will see on your checkout.', 'sslcommerz-woocommerce'),
                    'default' => __('Pay securely via SSLCommerz using your credit card, debit card, or mobile banking.', 'sslcommerz-woocommerce'),
                    'desc_tip' => true,
                ),
                'testmode' => array(
                    'title' => __('Test mode', 'sslcommerz-woocommerce'),
                    'label' => __('Enable Test Mode', 'sslcommerz-woocommerce'),
                    'type' => 'checkbox',
                    'description' => __('Place the payment gateway in test mode using test API keys.', 'sslcommerz-woocommerce'),
                    'default' => 'yes',
                    'desc_tip' => true,
                ),
                'store_id' => array(
                    'title' => __('Store ID', 'sslcommerz-woocommerce'),
                    'type' => 'text',
                    'description' => __('Get your Store ID from SSLCommerz dashboard.', 'sslcommerz-woocommerce'),
                    'default' => '',
                    'desc_tip' => true,
                ),
                'store_password' => array(
                    'title' => __('Store Password', 'sslcommerz-woocommerce'),
                    'type' => 'password',
                    'description' => __('Get your Store Password from SSLCommerz dashboard.', 'sslcommerz-woocommerce'),
                    'default' => '',
                    'desc_tip' => true,
                ),
            );
        }

        /**
         * Process the payment
         */
        public function process_payment($order_id) {
            global $woocommerce;
            $order = wc_get_order($order_id);

            // Get the endpoint URL
            if ($this->testmode) {
                $api_url = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
            } else {
                $api_url = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
            }

            // Prepare post data
            $post_data = array(
                'store_id' => $this->store_id,
                'store_passwd' => $this->store_password,
                'total_amount' => $order->get_total(),
                'currency' => get_woocommerce_currency(),
                'tran_id' => 'ORDER-' . $order_id . '-' . time(),
                'success_url' => add_query_arg('wc-api', 'WC_Gateway_SSLCommerz', home_url('/')),
                'fail_url' => add_query_arg('wc-api', 'WC_Gateway_SSLCommerz', home_url('/')),
                'cancel_url' => $order->get_cancel_order_url_raw(),
                'ipn_url' => add_query_arg('wc-api', 'WC_Gateway_SSLCommerz', home_url('/')),
                
                // Customer Information
                'cus_name' => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
                'cus_email' => $order->get_billing_email(),
                'cus_add1' => $order->get_billing_address_1(),
                'cus_city' => $order->get_billing_city(),
                'cus_country' => $order->get_billing_country(),
                'cus_phone' => $order->get_billing_phone(),
                
                // Shipping Information
                'shipping_method' => 'NO',
                'product_name' => 'Order #' . $order_id,
                'product_category' => 'General',
                'product_profile' => 'general',
            );

            // Make API request
            $response = wp_remote_post($api_url, array(
                'method' => 'POST',
                'timeout' => 45,
                'body' => $post_data,
            ));

            if (is_wp_error($response)) {
                wc_add_notice(__('Connection error. Please try again.', 'sslcommerz-woocommerce'), 'error');
                return;
            }

            $body = json_decode(wp_remote_retrieve_body($response), true);

            if (isset($body['status']) && $body['status'] == 'SUCCESS') {
                // Store transaction ID
                update_post_meta($order_id, '_sslcommerz_tran_id', $post_data['tran_id']);
                
                // Redirect to payment page
                return array(
                    'result' => 'success',
                    'redirect' => $body['GatewayPageURL']
                );
            } else {
                $error_message = isset($body['failedreason']) ? $body['failedreason'] : __('Payment initialization failed. Please try again.', 'sslcommerz-woocommerce');
                wc_add_notice($error_message, 'error');
                return;
            }
        }

        /**
         * Webhook handler
         */
        public function webhook() {
            $order_id = isset($_POST['value_a']) ? sanitize_text_field($_POST['value_a']) : 0;
            
            if (!$order_id) {
                // Try to extract from tran_id
                $tran_id = isset($_POST['tran_id']) ? sanitize_text_field($_POST['tran_id']) : '';
                if (preg_match('/ORDER-(\d+)-/', $tran_id, $matches)) {
                    $order_id = $matches[1];
                }
            }

            if (!$order_id) {
                wp_die('Order ID not found', 'Payment Verification', array('response' => 400));
            }

            $order = wc_get_order($order_id);

            if (!$order) {
                wp_die('Invalid order', 'Payment Verification', array('response' => 400));
            }

            $status = isset($_POST['status']) ? sanitize_text_field($_POST['status']) : '';
            $val_id = isset($_POST['val_id']) ? sanitize_text_field($_POST['val_id']) : '';

            // Verify the transaction
            if ($this->testmode) {
                $validation_url = 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';
            } else {
                $validation_url = 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';
            }

            $validation_response = wp_remote_get($validation_url . '?val_id=' . $val_id . '&store_id=' . $this->store_id . '&store_passwd=' . $this->store_password);
            
            if (!is_wp_error($validation_response)) {
                $validation_data = json_decode(wp_remote_retrieve_body($validation_response), true);

                if ($status == 'VALID' || $status == 'VALIDATED') {
                    // Payment successful
                    $order->payment_complete($val_id);
                    $order->add_order_note(sprintf(__('SSLCommerz payment completed. Transaction ID: %s', 'sslcommerz-woocommerce'), $val_id));
                    
                    wp_redirect($this->get_return_url($order));
                    exit;
                } else {
                    // Payment failed
                    $order->update_status('failed', __('Payment failed via SSLCommerz.', 'sslcommerz-woocommerce'));
                    
                    wp_redirect($order->get_cancel_order_url());
                    exit;
                }
            }

            wp_die('Payment verification failed', 'Payment Verification', array('response' => 400));
        }
    }
}
add_action('plugins_loaded', 'init_sslcommerz_gateway_class');
