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
  },
});
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
