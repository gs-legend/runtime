import { dataService } from "@kagami/core";
import apiClient from "../apiClient";

export const dmsService = {
    viewDocument: (payload: any) => apiClient.post(dataService.BASE_URL + 'dms/viewDocument', payload, { withCredentials: true }),
};