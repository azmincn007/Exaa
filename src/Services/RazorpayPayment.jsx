import React from 'react';
import { useNavigate } from 'react-router-dom';

const RazorpayPaymentModal = ({ orderId, amount, onSuccess, notes }) => {
  console.log("hii");
  
  console.log(amount);
  console.log(orderId);

  
  const navigate = useNavigate();

  const openRazorpayModal = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    const options = {
      key: 'rzp_test_dgIspPVd3h7OsH',
      amount: amount,
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Package Subscription',
      order_id: orderId,
      notes: notes || {},
      handler: function (response) {
        // Log the payment ID
        console.log('Razorpay Payment ID:', response.razorpay_payment_id);
        
        onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
        if (this.modal && typeof this.modal.close === 'function') {
          this.modal.close();
        }
        navigate(-2);
      },
      prefill: {
        name: 'Your Name',
        email: 'email@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#F37254',
      },
      modal: {
        ondismiss: function() {
          console.log('Checkout form closed');
          navigate(-2);
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  return { openRazorpayModal };
};

export default RazorpayPaymentModal;