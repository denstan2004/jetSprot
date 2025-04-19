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
  const data: loginRes = await axios.post(
    "http://127.0.0.1:8000/api/auth/login/",
    {username: userName , password: password}
  );

  const assecToken = jwtDecode(data.access);

  console.log(assecToken);
};
