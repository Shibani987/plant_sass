import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getApiError } from "../../services/api";

const savedUser = localStorage.getItem("plant_saas_user");
const savedStore = localStorage.getItem("plant_saas_store");

const persistSession = (payload) => {
  localStorage.setItem("plant_saas_token", payload.token);
  localStorage.setItem("plant_saas_user", JSON.stringify(payload.user));
  if (payload.store) {
    localStorage.setItem("plant_saas_store", JSON.stringify(payload.store));
  } else {
    localStorage.removeItem("plant_saas_store");
  }
};

export const login = createAsyncThunk("auth/login", async (form, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", form);
    persistSession(data);
    return data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

export const register = createAsyncThunk("auth/register", async (form, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", form);
    persistSession(data);
    return data;
  } catch (error) {
    return rejectWithValue(getApiError(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    store: savedStore ? JSON.parse(savedStore) : null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.store = null;
      localStorage.removeItem("plant_saas_token");
      localStorage.removeItem("plant_saas_user");
      localStorage.removeItem("plant_saas_store");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.store = action.payload.store;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.store = action.payload.store;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
