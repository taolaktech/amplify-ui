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
