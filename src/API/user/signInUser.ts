import { User } from "@/types/User";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AppDispatch } from "@/store/redux/store";
import { setUser } from "@/store/redux/slices/userSlice";
import { apiUrl } from "../apiUrl";

export interface loginRes {
  access: string;
  refresh: string;
}

interface JwtPayload {
  user_id: number;
}

export const signInData = async (
  userName: string,
  password: string,
  dispatch: AppDispatch
) => {
  try {
    const data = await axios.post<loginRes>(
      `${apiUrl}/auth/login/`,
      {
        username: userName,
        password: password,
      }
    );
    const { access, refresh } = data.data;
    const assecToken: JwtPayload = jwtDecode(access);
    const userId = assecToken.user_id;

    const getUserData = await axios.get<User>(
      `${apiUrl}/user/${userId}`
    );

    dispatch(
      setUser({
        accessToken: access,
        refreshToken: refresh,
        userData: getUserData.data,
        //TODO password
      })
    );
    return true
  } catch (err) {
    console.log(err);
    return false 
  }
};
