import { apiUrl } from "@/API/apiUrl";
import { Marker } from "@/types/Marker";
import axios from "axios";
interface MarkerRequestInterface{
    count: number,
    next: string | null,
    previous: string | null,
    results: Marker[]
}

export const getAllMarkers= async()=>{
    const response = await axios.get<MarkerRequestInterface>(`${apiUrl}/marker/`);
    return response.data;
}