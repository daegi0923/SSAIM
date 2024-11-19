// src/feature/project/api/fetchWeeklyData.ts
import axios from 'axios';



export const fetchDashboardData = async (startDate: string) => {
    const response = await axios.get(`/weekly-data?start=${startDate}`);
    return response.data;
};
