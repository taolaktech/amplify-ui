// import axios from "axios";
import axiosInstance from "./axios";

export const getCustomerPaymentMethods = async (token: string) => {
  const response = await axiosInstance.get(
    "/stripe/customers/payment-methods",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const createCustomer = async (
  token: string,
  fullName: string,
  country: string
) => {
  const response = await axiosInstance.post(
    "/stripe/customers/create",
    {
      metadata: { name: fullName, country: country },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const subscribeToPlan = async (data: {
  token: string;
  price: string;
  paymentMethodId: string;
}) => {
  const { token, price, paymentMethodId } = data;
  const response = await axiosInstance.post(
    "/stripe/subscriptions/subscribe",
    {
      priceId: price,
      paymentMethodId: paymentMethodId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
