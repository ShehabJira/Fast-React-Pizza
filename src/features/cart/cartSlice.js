import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cart: [],
};
// cart should contain an array of pizzas objects with these information
// cart: [
//   {
//     pizzaId: 12,
//     name: "Mediterranean",
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
// ]

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      //payload = newItem
      state.cart.push(action.payload);
    },
    deleteItem(state, action) {
      //payload = pizzaId
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },
    increaseItemQuantity(state, action) {
      //first find that item then increase the quantity of that item.
      //payload = pizzaId
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity++;
      //from here we can update the total price as it's a derived state.
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity--;

      //from here we can update the total price as it's a derived state.
      item.totalPrice = item.quantity * item.unitPrice;

      // if the quantity === 0, we want to delete this item, instead of writing the same code of the deleteItem, we can call that delete reducer case with our state and action here.
      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
    },
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

export const getCart = (store) => store.cart.cart;

export const getTotalCartQuantity = (store) =>
  store.cart.cart.reduce((sum, cur) => sum + cur.quantity, 0);

export const getTotalCartPrice = (store) =>
  store.cart.cart.reduce((sum, cur) => sum + cur.totalPrice, 0);
// search about => reselect
export const getCurrentQuantityById = (id) => (store) =>
  store.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
