import axios from "axios";

const getCountries = async (prefix: string) => {
  const response = await axios.get(`http://geodb-free-service.wirefreethought.com/v1/geo/countries?namePrefix=${prefix}&limit=10`);
  return response.data.data;
};

export default getCountries;
