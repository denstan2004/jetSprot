import { AppDispatch } from "@/store/redux/store";
import { User } from "@/types/User";
import axios from "axios";
import { loginRes } from "./signInUser";
import { setUser } from "@/store/redux/slices/userSlice";

export const signUpData = async (
  username: string,
  password: string,
  email: string,
  first_name: string,
  last_name: string,
  dispatch: AppDispatch
) => {
  try {
    const data = await axios.post<User>("http://192.168.0.104:8000/api/user/", {
      username,
      email,
      password,
      first_name,
      last_name,
    });
    const data2 = await axios.post<loginRes>(
      "http://192.168.0.104:8000/api/auth/login/",
      {
        username,
        password: password,
      }
    );
    const { access, refresh } = data2.data;

    dispatch(
      setUser({
        accessToken: access,
        refreshToken: refresh,
        userData: data.data,
      })
    );
    return true;
  } catch (err) {
    return false;
    console.error(err);
  }
};
