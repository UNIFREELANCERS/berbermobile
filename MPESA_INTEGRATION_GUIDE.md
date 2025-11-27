# M-Pesa Daraja Payment Integration Guide

## Overview
This document provides instructions for setting up and configuring M-Pesa Daraja payment integration in your Hair Hustler application.

## Files Modified/Created

### New Files:
- **`mpesa-payment.js`** - Core M-Pesa payment integration logic

### Modified Files:
- **`findservice.html`** - Added M-Pesa payment modals
- **`events.html`** - Added M-Pesa payment modals
- **`services.js`** - Updated to use M-Pesa payment
- **`events.js`** - Updated to use M-Pesa payment
- **`styles.css`** - Added M-Pesa styling

## Setup Instructions

### 1. Get M-Pesa Daraja Credentials

To use M-Pesa payments, you'll need:
- **Consumer Key** - API authentication key
- **Consumer Secret** - API authentication secret
- **Short Code** - Your M-Pesa merchant short code
- **Pass Key** - M-Pesa Pass Key (usually provided by Safaricom)
- **Party B** - Merchant paybill number
- **Callback URL** - URL where payment confirmation will be sent

Get these from: https://developer.safaricom.co.ke/

### 2. Configure Credentials

Open `mpesa-payment.js` and update the `MPESA_CONFIG` object:

```javascript
const MPESA_CONFIG = {
    consumerKey: 'YOUR_CONSUMER_KEY',
    consumerSecret: 'YOUR_CONSUMER_SECRET',
    shortCode: 'YOUR_SHORT_CODE',
    passkey: 'YOUR_PASS_KEY',
    partyB: 'YOUR_MERCHANT_PAYBILL',
    callbackUrl: 'YOUR_CALLBACK_URL',
    accountReference: 'HairHustler'
};
```

### 3. Backend Setup Required

You need to create backend endpoints to handle M-Pesa API calls:

#### Endpoint 1: `/api/mpesa/stk-push`
**Method:** POST

**Request Body:**
```json
{
    "BusinessShortCode": "merchant_shortcode",
    "Password": "base64_encoded_password",
    "Timestamp": "20240101120000",
    "TransactionType": "CustomerPayBillOnline",
    "Amount": 100,
    "PartyA": "254712345678",
    "PartyB": "174379",
    "PhoneNumber": "254712345678",
    "CallBackURL": "https://yourdomain.com/mpesa/callback",
    "AccountReference": "HairHustler-service-1",
    "TransactionDesc": "Payment for service - 1",
    "Remark": "Hair Hustler Payment"
}
```

**Response:**
```json
{
    "success": true,
    "message": "STK push initiated",
    "checkoutRequestID": "ws_CO_101120240101120000",
    "customerMessage": "success"
}
```

#### Endpoint 2: `/api/mpesa/payment-status/{accountReference}`
**Method:** GET

**Response:**
```json
{
    "status": "success|failed|pending",
    "transactionId": "LK451H35OP",
    "amount": 100,
    "message": "Payment successful"
}
```

#### Endpoint 3: `/mpesa/callback` (Webhook)
**Method:** POST

Receives payment confirmation from M-Pesa.

### 4. Backend Implementation Example (Node.js/Express)

```javascript
const axios = require('axios');

// Get Access Token
async function getAccessToken() {
    const auth = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');
    
    const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
            headers: { Authorization: `Basic ${auth}` }
        }
    );
    
    return response.data.access_token;
}

// Initiate STK Push
app.post('/api/mpesa/stk-push', async (req, res) => {
    try {
        const token = await getAccessToken();
        
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            req.body,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        
        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check Payment Status
app.get('/api/mpesa/payment-status/:accountReference', (req, res) => {
    // Query your database for payment status
    const payment = db.getPayment(req.params.accountReference);
    res.json({ status: payment.status });
});

// Payment Callback
app.post('/mpesa/callback', (req, res) => {
    const body = req.body.Body.stkCallback;
    
    if (body.ResultCode === 0) {
        // Payment successful
        const accountReference = body.CallbackMetadata.Item[1].Value;
        updatePaymentStatus(accountReference, 'success');
    } else {
        // Payment failed
        const accountReference = body.CallbackMetadata.Item[1].Value;
        updatePaymentStatus(accountReference, 'failed');
    }
    
    res.json({ success: true });
});
```

## Features

### For Services (findservice.html):
1. Click "Pay with M-Pesa" button on any service
2. Enter your phone number
3. Confirm payment terms
4. Receive M-Pesa prompt on your phone
5. Enter M-Pesa PIN to complete payment
6. Automatic confirmation when payment succeeds

### For Events (events.html):
1. Click "Pay with M-Pesa" button on any event
2. Enter your phone number
3. Confirm payment terms
4. Complete payment via M-Pesa
5. Receive booking confirmation

## JavaScript API

### Main Functions:

```javascript
// Initiate payment
initiateMpesaPayment(phoneNumber, amount, itemId, itemType);

// Open payment form modal
openMpesaPaymentForm(itemId, itemType, itemName, price);

// Close payment form
closeMpesaFormModal();

// Close payment status modal
closeMpesaModal();

// Get all transactions
getMpesaTransactions();

// Get specific transaction
getMpesaTransaction(accountReference);
```

## Security Considerations

1. **Never expose credentials in frontend code** - Always keep Consumer Key, Consumer Secret, and other sensitive data on backend
2. **Use environment variables** - Store all credentials in .env files
3. **Validate phone numbers** - Ensure proper format before sending
4. **Verify callbacks** - Always verify payment callbacks on backend
5. **Use HTTPS** - All API calls should use HTTPS
6. **Store transactions securely** - Keep payment records in database, not just localStorage

## Testing

### Sandbox Testing:
- Use M-Pesa Daraja sandbox environment for testing
- Test phone number: 254708374149 (Sandbox)
- Test amount: Any amount (will be deducted from sandbox account)

### Production:
- Switch endpoints to production URLs
- Use real consumer credentials
- Thoroughly test before going live

## Currency

All prices are displayed in **KES (Kenyan Shillings)**. Update the currency display if needed in:
- `services.js` (service prices)
- `events.js` (event prices)
- HTML templates (price labels)

## Troubleshooting

### Issue: "STK Push Failed"
- Verify credentials are correct
- Check phone number format (should be 254XXXXXXXXX)
- Ensure backend endpoint is accessible
- Check network connectivity

### Issue: "Payment Status Unknown"
- Ensure callback endpoint is properly configured
- Check if payment was actually completed on device
- Verify database connection
- Wait a few seconds for confirmation to arrive

### Issue: "Modal Not Showing"
- Ensure `mpesa-payment.js` is loaded after HTML
- Check browser console for JavaScript errors
- Verify modal IDs match in HTML and JavaScript

## Support

For M-Pesa Daraja API support: https://developer.safaricom.co.ke/

## License

This integration is part of the Hair Hustler application.
