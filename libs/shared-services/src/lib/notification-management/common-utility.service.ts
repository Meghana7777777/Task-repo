import axios from "axios";
import { AxiosInstance } from "../axios-instance";


export class CommonUtitlityService {
    async getAddressForPincode(pincode): Promise<any> {
        try {
          const response = await AxiosInstance.get(`https://api.postalpincode.in/pincode/${pincode}`);
          if (response && response.status === 200) {
            return response.data;
          } else {
            throw new Error("Failed to fetch data");
          }
        } catch (err) {
          throw new Error(err.message || "An error occurred while fetching the pincode data");
        }
      }
}