import {
    fetchIDCardProducts,
    calculateIDCardPrice,
    fetchIDCardProductById,
    createIDCardOrder,
    IDCardProduct,
    IDCardPriceResponse,
    CreateIDCardOrderRequest,
    CreateIDCardOrderResponseData,
    IDCardOrder,
    fetchAllOrders, // <-- Optionally import an order type if you have one (update as per your API)
} from "@/api/id";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IDCardState {
    products: IDCardProduct[];
    selectedProduct: IDCardProduct | null;
    calculatedPrice: IDCardPriceResponse | null;
    loading: boolean;
    error: string | null;

    // New for order creation
    orderResponse: CreateIDCardOrderResponseData | null;

    // Add for fetch all my orders
    myOrders: IDCardOrder[]; 
    fetchMyOrders: () => Promise<void>;

    fetchProducts: () => Promise<void>;
    fetchProductById: (id: string) => Promise<void>;
    calculateProductPrice: (
        id: string,
        quantity: number
    ) => Promise<void>;

    createOrder: (orderData: CreateIDCardOrderRequest) => Promise<CreateIDCardOrderResponseData>;
}

export const useIDCardStore = create<IDCardState>()(
    persist(
        (set) => ({
            products: [],
            selectedProduct: null,
            calculatedPrice: null,
            loading: false,
            error: null,
            orderResponse: null,
            myOrders: [],

            fetchProducts: async () => {
                set({ loading: true, error: null });
                try {
                    const data = await fetchIDCardProducts();
                    set({ products: data, loading: false });
                } catch (err: any) {
                    set({
                        error: err.message || "Unknown error",
                        loading: false,
                        products: [],
                    });
                }
            },
            fetchProductById: async (id: string) => {
                set({ loading: true, error: null, selectedProduct: null });
                try {
                    const product = await fetchIDCardProductById(id);
                    set({ selectedProduct: product, loading: false });
                } catch (err: any) {
                    set({
                        error: err.message || "Failed to fetch ID Card product",
                        loading: false,
                        selectedProduct: null
                    });
                }
            },
            calculateProductPrice: async (id: string, quantity: number) => {
                set({ loading: true, error: null, calculatedPrice: null });
                try {
                    const price = await calculateIDCardPrice(id, quantity);
                    set({ calculatedPrice: price, loading: false });
                } catch (err: any) {
                    set({
                        error: err.message || "Failed to calculate ID Card price",
                        loading: false,
                        calculatedPrice: null
                    });
                }
            },
            createOrder: async (orderData: CreateIDCardOrderRequest): Promise<CreateIDCardOrderResponseData> => {
                set({ loading: true, error: null, orderResponse: null });
                try {
                    const response = await createIDCardOrder(orderData);
                    set({ orderResponse: response, loading: false });
                    toast.success("Order Placed Successfully!");
                    console.log("response::, ", response)
                    return response;
                } catch (err: any) {
                    toast.error("Failed to create ID Card order");
                    set({
                        error: err.message || "Failed to create ID Card order",
                        loading: false,
                        orderResponse: null,
                    });
                    throw err;
                }
            },
            // Add fetchMyOrders implementation
            fetchMyOrders: async () => {
                set({ loading: true, error: null });
                try {
                    const orders = await fetchAllOrders();
                    set({ myOrders: orders, loading: false });
                } catch (err: any) {
                    set({
                        error: err.message || "Failed to fetch orders",
                        loading: false,
                        myOrders: [],
                    });
                }
            },
        }),
        {
            name: "idcard-storage", // unique name
            partialize: (state) => ({
                products: state.products,
                selectedProduct: state.selectedProduct,
                calculatedPrice: state.calculatedPrice,
                orderResponse: state.orderResponse,
                myOrders: state.myOrders, // include this for persistence
            }),
        }
    )
);
