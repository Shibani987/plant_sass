import { createSlice } from "@reduxjs/toolkit";

const savedCart = localStorage.getItem("plant_saas_cart");

const saveCart = (items) => {
  localStorage.setItem("plant_saas_cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: savedCart ? JSON.parse(savedCart) : [],
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      saveCart(state.items);
    },
    updateQuantity(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
      saveCart(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const { addToCart, clearCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
