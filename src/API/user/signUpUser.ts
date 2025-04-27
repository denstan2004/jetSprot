import { AppDispatch } from "@/store/redux/store";
import { User } from "@/types/User";
import axios from "axios";
import { loginRes } from "./signInUser";
import { setUser } from "@/store/redux/slices/userSlice";
import { apiUrl } from "../apiUrl";

export const signUpData = async (
  username: string,
  password: string,
  email: string,
  first_name: string,
  last_name: string,
  dispatch: AppDispatch
) => {
  try {
    const data = await axios.post<User>(`${apiUrl}/user/`, {
      username,
      email,
      password,
      first_name,
      last_name,
    });
    const data2 = await axios.post<loginRes>(`${apiUrl}/auth/login/`, {
      username,
      password: password,
    });
    const { access, refresh } = data2.data;

    dispatch(
      setUser({
        accessToken: access,
        refreshToken: refresh,
        userData: data.data,
        //TODO password
      })
    );
    return true;
  } catch (err) {
    console.error("Error signing up:", err);
    return false;
  }
};
