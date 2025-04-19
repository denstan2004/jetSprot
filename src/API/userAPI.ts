import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface loginRes {
  access: string;
  refresh: string;
}

interface jwtInt {
  access: string;
  refresh: string;
}

export const getData = async (userName: string, password: string) => {
  try {
    const data = await axios.post(
      "http://192.168.0.102:8000/api/auth/login/",
      { username: userName, password: password }
    );
    console.log(data.data);
    const assecToken = jwtDecode(data.data.access);
    console.log(assecToken);
  } catch (err) {
    console.error(err);
  }
};
