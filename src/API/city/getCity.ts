import axios from "axios";

const getCity = async ( country: string, prefix: string) => {
  const response = await axios.get(
    `http://geodb-free-service.wirefreethought.com/v1/geo/countries/${country}/places?limit=10&types=CITY&namePrefix=${prefix}`
  );
  return response.data.data;
};

export default getCity;
