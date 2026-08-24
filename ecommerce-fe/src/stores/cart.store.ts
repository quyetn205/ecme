import { create } from 'zustand';
import { CartItemResponse } from '@/types';
import { setItem, getItem } from '@/lib/storage';
import { STORAGE_KEY } from '@/constants';

interface CartState {
    items: CartItemResponse[];
    totalItems: number;
    setItems: (items: CartItemResponse[]) => void;
    addItem: (item: CartItemResponse) => void;
    updateItemQuantity: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    persistCart: () => void;
    loadCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    totalItems: 0,

    setItems: (items: CartItemResponse[]) => {
        set({ items, totalItems: items.length });
    },

    addItem: (item: CartItemResponse) => {
        const { items } = get();
        const existingIndex = items.findIndex(
            (i) => i.productId === item.productId
        );

        if (existingIndex >= 0) {
            const updated = [...items];
            updated[existingIndex] = {
                ...updated[existingIndex],
                quantity: updated[existingIndex].quantity + item.quantity
            };
            set({ items: updated, totalItems: updated.length });
        } else {
            const updated = [...items, item];
            set({ items: updated, totalItems: updated.length });
        }
    },

    updateItemQuantity: (id: number, quantity: number) => {
        const { items } = get();
        if (quantity <= 0) {
            const updated = items.filter((i) => i.id !== id);
            set({ items: updated, totalItems: updated.length });
        } else {
            const updated = items.map((i) =>
                i.id === id ? { ...i, quantity } : i
            );
            set({ items: updated });
        }
    },

    removeItem: (id: number) => {
        const { items } = get();
        const updated = items.filter((i) => i.id !== id);
        set({ items: updated, totalItems: updated.length });
    },

    clearCart: () => {
        set({ items: [], totalItems: 0 });
    },

    persistCart: () => {
        setItem(STORAGE_KEY.CART_STATE, get().items);
    },

    loadCart: () => {
        const items = getItem<CartItemResponse[]>(STORAGE_KEY.CART_STATE);
        if (items) {
            set({ items, totalItems: items.length });
        }
    }
}));
