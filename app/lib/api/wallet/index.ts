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
  prorationBehavior: "create_prorations" | "none";
}) => {
  const { token, newPriceId, prorationBehavior } = data;
  const response = await axiosInstance.put(
    "/stripe/subscriptions/change-plan",
    {
      newPriceId,
      prorationBehavior,
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
  const response = await axiosInstance.get(
    "/stripe/subscriptions/current?sync=true",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const setDefaultPaymentMethod = async (data: {
  token: string;
  paymentMethodId: string;
}) => {
  const response = await axiosInstance.put(
    `/stripe/customers/payment-methods/set-default`,
    { paymentMethodId: data.paymentMethodId }, // <-- this is the request body
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

export const removePaymentMethod = async (data: {
  token: string;
  paymentMethodId: string;
}) => {
  const response = await axiosInstance.delete(
    `/stripe/customers/payment-methods/${data.paymentMethodId}`,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

// curl https://dev-wallet.useamplify.ai/wallet/top-up \
//   --request POST \
//   --header 'idempotency-key: ' \
//   --header 'Content-Type: application/json' \
//   --data '{
//   "amount": 100,
//   "paymentMethodId": "pm_1P7kvL2eZvKYlo2C9GvA3B4C"
// }'

export const topUpWallet = async (data: {
  token: string;
  amount: number;
  idempotencyKey: string;
  paymentMethodId: string;
}) => {
  const response = await axiosInstance.post(
    "/wallet/top-up",
    {
      amount: data.amount,
      paymentMethodId: data.paymentMethodId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "idempotency-key": data.idempotencyKey,
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};
