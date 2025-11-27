// M-Pesa Daraja Payment Integration

// M-Pesa Configuration
const MPESA_CONFIG = {
    consumerKey: 'FPY4tSPZvc8VrAcyJq8uqVSZnDG6NKb0Dasp40sRrx6vdrPy',
    consumerSecret: 'kU7R6Fz58GI7aTMhy5Vckk9MxPpbBiweXFgKmC5QhM9SvD5XLszHp2W7bvENGbHZ',
    shortCode: '174379',
    passkey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    partyA: null, // Will be set at runtime
    partyB: null, // Merchant paybill number
    callbackUrl: 'https://unifreelancers.github.io/berbermobile/findservice.html/mpesa-express-simulate/',
    accountReference: 'HairHustler'
};

// Initialize M-Pesa Payment
function initiateMpesaPayment(phoneNumber, amount, itemId, itemType) {
    // Validate phone number format (Kenyan format)
    if (!phoneNumber.match(/^254\d{9}$|^\d{10}$/)) {
        alert('Please enter a valid Kenyan phone number (e.g., 254712345678 or 0712345678)');
        return;
    }

    // Convert phone number to proper format
    if (!phoneNumber.startsWith('254')) {
        phoneNumber = '254' + phoneNumber.substring(1);
    }

    // Generate timestamp
    const timestamp = generateTimestamp();
    
    // Generate password
    const password = generatePassword(timestamp);

    // Prepare payment request
    const paymentRequest = {
        BusinessShortCode: MPESA_CONFIG.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: MPESA_CONFIG.partyB,
        PhoneNumber: phoneNumber,
        CallBackURL: MPESA_CONFIG.callbackUrl,
        AccountReference: `${MPESA_CONFIG.accountReference}-${itemType}-${itemId}`,
        TransactionDesc: `Payment for ${itemType} - ${itemId}`,
        Remark: 'Hair Hustler Payment'
    };

    // Store transaction details for verification
    storeTransactionDetails(paymentRequest, itemId, itemType, amount);

    // Send STK push request
    sendStkPushRequest(paymentRequest);
}

// Generate timestamp
function generateTimestamp() {
    const date = new Date();
    return date.toISOString().replace(/[:\-]/g, '').slice(0, 14);
}

// Generate password (Base64 encoded)
function generatePassword(timestamp) {
    const shortCode = MPESA_CONFIG.shortCode;
    const passkey = MPESA_CONFIG.passkey;
    const concatenated = shortCode + passkey + timestamp;
    return btoa(concatenated);
}

// Send STK Push Request to M-Pesa
function sendStkPushRequest(paymentRequest) {
    // Show processing message
    showPaymentModal('Processing', 'Initiating M-Pesa payment...');

    // In production, send to your backend
    // Your backend should handle the actual M-Pesa API call
    fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentRequest)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showPaymentModal('Success', 'M-Pesa prompt sent! Please complete payment on your phone.');
            // Poll for payment status
            pollPaymentStatus(paymentRequest.AccountReference);
        } else {
            showPaymentModal('Error', data.message || 'Failed to initiate payment. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showPaymentModal('Error', 'Network error. Please check your connection and try again.');
    });
}

// Store transaction details
function storeTransactionDetails(paymentRequest, itemId, itemType, amount) {
    const transaction = {
        accountReference: paymentRequest.AccountReference,
        itemId: itemId,
        itemType: itemType,
        amount: amount,
        phoneNumber: paymentRequest.PartyA,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    // Store in localStorage
    let transactions = JSON.parse(localStorage.getItem('mpesaTransactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('mpesaTransactions', JSON.stringify(transactions));
}

// Poll for payment status
function pollPaymentStatus(accountReference) {
    let pollCount = 0;
    const maxPolls = 60; // Poll for 5 minutes (30 seconds x 60)
    const pollInterval = 5000; // 5 seconds

    const pollTimer = setInterval(() => {
        pollCount++;

        // Check payment status from backend
        fetch(`/api/mpesa/payment-status/${accountReference}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    clearInterval(pollTimer);
                    handlePaymentSuccess(accountReference);
                } else if (data.status === 'failed') {
                    clearInterval(pollTimer);
                    handlePaymentFailure(accountReference);
                }
            })
            .catch(error => console.error('Status poll error:', error));

        // Stop polling after max attempts
        if (pollCount >= maxPolls) {
            clearInterval(pollTimer);
        }
    }, pollInterval);
}

// Handle payment success
function handlePaymentSuccess(accountReference) {
    const transactions = JSON.parse(localStorage.getItem('mpesaTransactions')) || [];
    const transaction = transactions.find(t => t.accountReference === accountReference);

    if (transaction) {
        transaction.status = 'completed';
        localStorage.setItem('mpesaTransactions', JSON.stringify(transactions));
        
        showPaymentModal('Payment Successful', `Your payment of KES ${transaction.amount} has been completed successfully!`);
        
        // You can add additional logic here, such as:
        // - Sending confirmation email
        // - Updating booking status
        // - Displaying confirmation page
    }
}

// Handle payment failure
function handlePaymentFailure(accountReference) {
    const transactions = JSON.parse(localStorage.getItem('mpesaTransactions')) || [];
    const transaction = transactions.find(t => t.accountReference === accountReference);

    if (transaction) {
        transaction.status = 'failed';
        localStorage.setItem('mpesaTransactions', JSON.stringify(transactions));
        
        showPaymentModal('Payment Failed', 'Your payment could not be completed. Please try again.');
    }
}

// Show payment modal
function showPaymentModal(title, message) {
    const paymentModal = document.getElementById('mpesaPaymentModal');
    if (paymentModal) {
        const modalTitle = paymentModal.querySelector('.mpesa-modal-title');
        const modalMessage = paymentModal.querySelector('.mpesa-modal-message');
        
        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.textContent = message;
        
        paymentModal.style.display = 'flex';
    }
}

// Close payment modal
function closeMpesaModal() {
    const paymentModal = document.getElementById('mpesaPaymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'none';
    }
}

// Open M-Pesa payment form
function openMpesaPaymentForm(itemId, itemType, itemName, price) {
    const formModal = document.getElementById('mpesaFormModal');
    if (formModal) {
        // Set form data
        document.getElementById('mpesaItemId').value = itemId;
        document.getElementById('mpesaItemType').value = itemType;
        document.getElementById('mpesaItemName').textContent = itemName;
        document.getElementById('mpesaAmount').value = price;
        
        formModal.style.display = 'flex';
    }
}

// Close M-Pesa payment form
function closeMpesaFormModal() {
    const formModal = document.getElementById('mpesaFormModal');
    if (formModal) {
        formModal.style.display = 'none';
    }
}

// Handle payment form submission
function handleMpesaFormSubmit(event) {
    event.preventDefault();
    
    const phone = document.getElementById('mpesaPhone').value;
    const amount = document.getElementById('mpesaAmount').value;
    const itemId = document.getElementById('mpesaItemId').value;
    const itemType = document.getElementById('mpesaItemType').value;
    
    if (!phone || !amount) {
        alert('Please fill in all required fields');
        return;
    }
    
    closeMpesaFormModal();
    initiateMpesaPayment(phone, amount, itemId, itemType);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        const mpesaFormModal = document.getElementById('mpesaFormModal');
        const mpesaPaymentModal = document.getElementById('mpesaPaymentModal');
        
        if (mpesaFormModal && e.target === mpesaFormModal) {
            closeMpesaFormModal();
        }
        if (mpesaPaymentModal && e.target === mpesaPaymentModal) {
            closeMpesaModal();
        }
    });
    
    // Handle form submission
    const mpesaForm = document.getElementById('mpesaPaymentForm');
    if (mpesaForm) {
        mpesaForm.addEventListener('submit', handleMpesaFormSubmit);
    }
});

// Get payment transactions
function getMpesaTransactions() {
    return JSON.parse(localStorage.getItem('mpesaTransactions')) || [];
}

// Get payment transaction by ID
function getMpesaTransaction(accountReference) {
    const transactions = getMpesaTransactions();
    return transactions.find(t => t.accountReference === accountReference);
}


