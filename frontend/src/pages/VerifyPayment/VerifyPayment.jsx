import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./VerifyPayment.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const VerifyPayment = () => {
  const navigate = useNavigate();

  const createOrder = async () => {
    const res = await axios.post(
      `${BACKEND_URL}/api/paypal/create-order`,
      {},
      { withCredentials: true }
    );
    return res.data.orderID;
  };

  const onApprove = async (data) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/paypal/capture-order`,
        { orderID: data.orderID },
        { withCredentials: true }
      );

      alert("Payment successful! You are now verified.");
      navigate("/profile");
    } catch {
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="verify-page">
        <div className="verify-card">
          <h2 className="verify-title">Get Verified</h2>
          <p className="verify-subtitle">
            Unlock a verified badge for your profile
          </p>

          <div className="paypal-wrapper">
            <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
              <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyPayment;
