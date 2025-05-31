import { getSports, SportInterface } from "@/API/sport/getSports";
import { RootState } from "@/store/redux/store";
import { Marker as MarkerType } from "@/types/Marker";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const MarkerIcon =  (marker: MarkerType, sports: SportInterface[], userId: number) => {
    console.log(marker.creator.id, userId)
  if (marker.creator.id === userId) {
    return (
      <Ionicons
        name="person"
        size={32}
        style={{ color: "#5B3400", width: 32, height: 32 }}
      />
    );
  }
  if (marker.sports.length === 1) {
    const sport = sports.find((s) => s.id === marker.sports[0].id);
    return (
      <Ionicons
        name={"basketball"}
        size={32}
        style={{ color: "#5B3400", width: 32, height: 32 }}
      />
    );
  }
  return (
    <Ionicons
      name="location"
      size={32}
      style={{ color: "#5B3400", width: 32, height: 32 }}
    />
  );
};
//soccer-field
export default MarkerIcon;
