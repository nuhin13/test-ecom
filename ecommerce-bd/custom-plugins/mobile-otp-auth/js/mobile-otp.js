jQuery(document).ready(function($) {
    let otpSent = false;

    // Send OTP button click
    $('#send_otp_btn').on('click', function(e) {
        e.preventDefault();
        
        const mobile = $('#reg_mobile').val();
        const button = $(this);
        
        // Validate mobile number
        if (!mobile || !mobile.match(/^01[0-9]{9}$/)) {
            alert('Please enter a valid Bangladesh mobile number (01XXXXXXXXX)');
            return;
        }

        // Disable button and show loading
        button.prop('disabled', true).text('Sending...');
        $('#otp_status').html('<span style="color: #666;">Sending OTP...</span>');

        // Send AJAX request
        $.ajax({
            url: mobileOtpAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'send_otp',
                mobile: mobile,
                nonce: mobileOtpAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    otpSent = true;
                    $('#otp_field').slideDown();
                    $('#otp_status').html('<span style="color: green;">✓ ' + response.data.message + '</span>');
                    button.prop('disabled', true).text('OTP Sent');
                    
                    // Auto focus on OTP field
                    $('#reg_otp').focus();
                    
                    // Enable resend after 60 seconds
                    let countdown = 60;
                    const countdownInterval = setInterval(function() {
                        countdown--;
                        button.text('Resend OTP (' + countdown + 's)');
                        
                        if (countdown <= 0) {
                            clearInterval(countdownInterval);
                            button.prop('disabled', false).text('Resend OTP');
                            otpSent = false;
                        }
                    }, 1000);
                } else {
                    $('#otp_status').html('<span style="color: red;">✗ ' + response.data.message + '</span>');
                    button.prop('disabled', false).text('Send OTP');
                }
            },
            error: function() {
                $('#otp_status').html('<span style="color: red;">✗ Error sending OTP. Please try again.</span>');
                button.prop('disabled', false).text('Send OTP');
            }
        });
    });

    // Verify OTP on input change
    $('#reg_otp').on('input', function() {
        const otp = $(this).val();
        
        if (otp.length === 6) {
            const mobile = $('#reg_mobile').val();
            
            $.ajax({
                url: mobileOtpAjax.ajax_url,
                type: 'POST',
                data: {
                    action: 'verify_otp',
                    mobile: mobile,
                    otp: otp,
                    nonce: mobileOtpAjax.nonce
                },
                success: function(response) {
                    if (response.success) {
                        $('#otp_status').html('<span style="color: green;">✓ OTP Verified!</span>');
                        $('#reg_otp').prop('readonly', true).css('border-color', 'green');
                    } else {
                        $('#otp_status').html('<span style="color: red;">✗ ' + response.data.message + '</span>');
                        $('#reg_otp').css('border-color', 'red');
                    }
                }
            });
        }
    });

    // Prevent form submission if OTP not sent
    $('form.woocommerce-form-register').on('submit', function(e) {
        const mobile = $('#reg_mobile').val();
        
        if (mobile && !otpSent) {
            e.preventDefault();
            alert('Please verify your mobile number by sending and entering OTP');
            $('#send_otp_btn').focus();
            return false;
        }
    });

    // Only allow numbers in OTP field
    $('#reg_otp').on('keypress', function(e) {
        const charCode = (e.which) ? e.which : e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
            return false;
        }
        return true;
    });
});
