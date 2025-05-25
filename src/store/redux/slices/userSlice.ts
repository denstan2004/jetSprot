import { User } from "@/types/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  accessToken: string;
  refreshToken: string;
  userData: User | null;
}

const initialState: UserState = {
  accessToken: "",
  refreshToken: "",
  userData: null,
};

interface updateUserInterface {
  username: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  pfp_url: string;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<UserState>) {
      return {
        ...state,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        userData: payload.userData,
      };
    },
    updateUser(state, { payload }: PayloadAction<Partial<User>>) {
      if (!state.userData) return;
      state.userData = {
        ...state.userData,
        ...payload,
      };
    },
    logout(state) {
      state.accessToken = "";
      state.refreshToken = "";
      state.userData = null;
    },
    setUserType(state, { payload }: PayloadAction<string>) {
      if (!state.userData) return;
      state.userData.account_type = payload;
    },
  },
});
export const { setUser, updateUser, logout, setUserType } = userSlice.actions;

export default userSlice.reducer;
