import axios from "axios";

const getCountries = async () => {
  const response = await axios.get(`http://geodb-free-service.wirefreethought.com/v1/geo/countries?namePrefix=uk&limit=10`);
  return response.data;
};

export default getCountries;
