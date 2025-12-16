import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

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

      <Box
        sx={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 420,
            width: "100%",
            background: "rgba(20,20,40,0.85)",
            border: "1px solid #3a3a5a",
            borderRadius: "16px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
            color: "#ffffff",
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <VerifiedIcon
              sx={{
                fontSize: 60,
                color: "#4fc3f7",
                mb: 1,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
                background:
                  "linear-gradient(135deg, #6c5ce7, #a29bfe)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Get Verified
            </Typography>

            <Typography sx={{ color: "#cfcfff", mb: 3 }}>
              Unlock a verified badge for your profile
            </Typography>

            <Divider
              sx={{
                mb: 3,
                background:
                  "linear-gradient(to right, transparent, #6c5ce7, transparent)",
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <PayPalScriptProvider
                options={{ "client-id": PAYPAL_CLIENT_ID }}
              >
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    shape: "rect",
                    color: "gold",
                    label: "pay",
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                />
              </PayPalScriptProvider>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default VerifyPayment;
