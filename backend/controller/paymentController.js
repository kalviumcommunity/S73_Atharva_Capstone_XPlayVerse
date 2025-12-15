import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import paypalClient from "../config/paypal.js";
import User from "../models/User.js";

export const createPaypalOrder = async (req, res) => {
  try {
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "1.00",
          },
        },
      ],
    });

    const order = await paypalClient.execute(request);
    res.status(200).json({ orderID: order.result.id });
  } catch (error) {
    res.status(500).json({ message: "PayPal order creation failed" });
  }
};

export const capturePaypalOrder = async (req, res) => {
  try {
    const { orderID } = req.body;

    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await paypalClient.execute(request);

    if (capture.result.status === "COMPLETED") {
      await User.findByIdAndUpdate(req.user.id, {
        isVerified: true,
        verificationDate: new Date(),
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Payment capture failed" });
  }
};
