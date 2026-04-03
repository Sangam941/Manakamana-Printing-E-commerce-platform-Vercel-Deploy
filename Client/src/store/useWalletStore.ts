import {
  fetchTopupRequestsApi,
  fetchWalletApi,
  submitWalletTopupApi,
  fetchPaymentDetailsApi,
  confirmWalletPaymentApi, // Add the import for confirm wallet payment
} from "@/api/wallet";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for Wallet
export interface Wallet {
  clientId: string;
  currency: "NPR";
  availableBalance: number;
}

// Types for Topup Request
export interface TopupRequest {
  requestId: string;
  submittedAmount: number;
  approvedAmount: number | null;
  paymentMethod: "BANK_TRANSFER"; // extend with union types if there are more methods in the future
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedAt?: string | null;
  rejectionReason: string | null;
}

// Types for Wallet Transaction
export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: "CREDIT" | "DEBIT" | "TOPUP";
  meta?: any;
  status: "SUCCESS" | "FAILED" | "PENDING";
  createdAt?: string;
}

// Payment Details structure from backend
export interface PaymentDetails {
  companyName: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string | null;
  paymentId: string | null;
  qrImageUrl: string | null;
  note: string | null;
}

export interface WalletStoreState {
  wallet: Wallet | null;
  loading: boolean;
  error: string | null;
  topupRequests: TopupRequest[];
  transactions: WalletTransaction[];
  paymentDetails: PaymentDetails | null;

  fetchWallet: () => Promise<void>;
//   fetchWalletTransactions: () => Promise<void>;
  fetchTopupRequests: () => Promise<void>;
  fetchPaymentDetails: () => Promise<void>;
  submitTopup: (formData: FormData) => Promise<void>;
  // Add the confirm method
  confirmWalletPayment: (orderId: string) => Promise<void>;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletStoreState>()(
  persist(
    (set, get) => ({
      wallet: null,
      loading: false,
      error: null,
      topupRequests: [],
      transactions: [],
      paymentDetails: null,

      fetchWallet: async () => {
        set({ loading: true, error: null });
        try {
          const data = await fetchWalletApi();
          set({ wallet: data, error: null });
        } catch (error: any) {
          set({ error: error?.message || "Failed to fetch wallet" });
        } finally {
          set({ loading: false });
        }
      },

    //   fetchWalletTransactions: async () => {
    //     set({ loading: true, error: null });
    //     try {
    //       const txs = await fetchWalletTransactionsApi();
    //       set({ transactions: Array.isArray(txs) ? txs : [], error: null });
    //     } catch (error: any) {
    //       set({ error: error?.message || "Failed to fetch transactions" });
    //     } finally {
    //       set({ loading: false });
    //     }
    //   },

      fetchTopupRequests: async () => {
        set({ loading: true, error: null });
        try {
          const topups = await fetchTopupRequestsApi();
          set({ topupRequests: Array.isArray(topups) ? topups : [], error: null });
        } catch (error: any) {
          set({ error: error?.message || "Failed to fetch topup requests" });
        } finally {
          set({ loading: false });
        }
      },

      fetchPaymentDetails: async () => {
        set({ loading: true, error: null });
        try {
          const data = await fetchPaymentDetailsApi();
          set({ paymentDetails: data ?? null, error: null });
        } catch (error: any) {
          set({ error: error?.message || "Failed to fetch payment details" });
        } finally {
          set({ loading: false });
        }
      },

      submitTopup: async (formData: FormData) => {
        set({ loading: true, error: null });
        try {
          const newTopup = await submitWalletTopupApi(formData);
          set((state) => ({
            topupRequests: [newTopup, ...state.topupRequests],
            error: null,
          }));

          // Also update the wallet balance after topup submission
          await get().fetchWallet();
        } catch (error: any) {
          set({ error: error?.message || "Failed to submit top-up request" });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Add confirmWalletPayment method
      confirmWalletPayment: async (orderId: string) => {
        set({ loading: true, error: null });
        try {
          const result = await confirmWalletPaymentApi(orderId);
          // Optionally update the wallet in  store to match the new balance after confirmation
          await get().fetchWallet();
         
        } catch (error: any) {
          set({ error: error?.message || "Failed to confirm wallet payment" });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      clearWallet: () => {
        set({
          wallet: null,
          error: null,
          loading: false,
          topupRequests: [],
          transactions: [],
          paymentDetails: null,
        });
      },
    }),
    {
      name: "wallet-storage",
    }
  )
);