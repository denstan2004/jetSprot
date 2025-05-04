import axios from "axios";

const getCity = async (countries: string, places: string) => {
  const response = await axios.get(`http://geodb-free-service.wirefreethought.com/v1/geo/${countries}/UA/${places}?limit=10&types=CITY&namePrefix=lv`);
  return response.data;
};

export default getCity;
