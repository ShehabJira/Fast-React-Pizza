import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

const initialState = {
  username: "",
  status: "idle",
  position: {},
  address: "",
  error: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state, action) => {
        // addCase => Adds a case reducer to handle a single exact action type.
        state.status = "loading";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle";
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = "error";
        state.error =
          "There was a problem getting your address. Make sure to fill this field!";
      }),
});
// The extraReducers section is a function that takes a builder object, which has methods
// like addCase and addMatcher that allow you to define how the slice should respond to
// different actions. In this case, we're using builder. addCase to define three cases:
// pending , fulfilled , and rejected .

export const { updateName } = userSlice.actions;
export default userSlice.reducer;

//                           Redux toolkit way of creating a Thunk function.
// - createAsyncThunk(action type name, actual Thunk function that will return the payload to the reducer later)
// - fetchAdress will become the action creator function that we will dispatch later in our code. (remember that thunk function is created in action object)
// which has the thunk function not an action object, this thunk will return the action object.payload to the reducer after some operations.
// Note! we should not call it getAddress because those names are reserved for selectors.
export const fetchAddress = createAsyncThunk(
  "user/fetchAddress",
  async function () {
    // 1) We get the user's geolocation position
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
    const addressObj = await getAddress(position);
    const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

    // 3) Then we return an object with the data that we are interested in
    return { position, address }; // data we return here, will become the payload of the FulFilled state.
  },
);

// createAsyncThunk produce 3 additional action types
// - one for the pending promise state
// - one for the fulfilled state
// - one for the rejected state
// so we need to handle these cases separatly back in our reducers. And this how we connect our Thunk with our reducers.
