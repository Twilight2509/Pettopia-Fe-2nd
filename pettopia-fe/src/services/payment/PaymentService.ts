import { apiClient } from '@/services/apiClient';

const API_URL = '/payments';

interface PaymentRequest {
  amount: number;
  description: string;
}

interface PaymentResponse {
  code: string;
  desc: string;
  data: {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    status: string;
    expiredAt: string | null;
    checkoutUrl: string;
    qrCode: string;
  };
  signature: string;
  userId: string;
  orderId: string;
}

interface PaymentStatusResponse {
  success: boolean;
  message: string;
  status: string;
  orderCode: number;
}

export const PaymentService = {
  async createPayment(payload: PaymentRequest): Promise<PaymentResponse> {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('Token not found');
    }

    const response = await apiClient.post<PaymentResponse>(API_URL, payload, {
      validateStatus: () => true,
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Payment API error: ${response.statusText}`);
    }

    const data: PaymentResponse = response.data;

    if (data.code !== '00') {
      throw new Error(data.desc || 'Payment creation failed');
    }

    return data;
  },

  async getPaymentStatus(orderCode: string): Promise<PaymentStatusResponse> {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('Token not found');
    }

    const statusUrl = `${API_URL}/payments/${orderCode}/status`;

    try {
      const response = await apiClient.get<PaymentStatusResponse>(statusUrl, {
        validateStatus: () => true,
      });

      if (response.status < 200 || response.status >= 300) {
        console.error('Payment status API error:', response.statusText, response.data);
        throw new Error(`Payment status API error: ${response.statusText}`);
      }

      const data: PaymentStatusResponse = response.data;

      // Check if the response is successful based on 'success' field
      if (!data.success) {
        throw new Error(data.message || 'Payment status check failed');
      }

      return data;
    } catch (error: any) {
      console.error('getPaymentStatus error:', error);
      throw error;
    }
  },
};
