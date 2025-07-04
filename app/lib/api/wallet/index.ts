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
  cardHolderName: string,
  country: string
) => {
  const response = await axiosInstance.post(
    "/stripe/customers/create",
    {
      metadata: { name: cardHolderName, country: country },
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

export const upgradePlan = async (data: {
  newPriceId: string;
  token: string;
}) => {
  const { token, newPriceId } = data;
  const response = await axiosInstance.put(
    "/stripe/subscriptions/change-plan",
    {
      newPriceId,
      prorationBehavior: "create_prorations",
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

export const getCurrentSubscriptionPlan = async (token: string) => {
  const response = await axiosInstance.get("/stripe/subscriptions/current", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("response from current subscription plan", response);
  return response.data;
};
