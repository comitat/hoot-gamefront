import { getTgInitData } from '@tools/getTgUserData';
import axiosInstance from './axiosInstance';

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/me'); // '/user/profile'
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const registerUser = async () => {
  try {
    const response = await axiosInstance.post('/user/register', {
      initData: getTgInitData(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};