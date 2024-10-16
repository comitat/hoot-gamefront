import axiosInstance from './axiosInstance';

export const getItems = async () => {
  try {
    const response = await axiosInstance.get('/store/items');
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

export const getServices = async () => {
  try {
    const response = await axiosInstance.get('/store/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const upgradeEnergy = async (amount: number) => {
  try {
    const response = await axiosInstance.post('/upgrade/energy', {
      timestamp: new Date().valueOf(),
      energy: amount,
    });
    return response;
  } catch (error) {
    console.error('Error upgrading energy:', error);
    throw error;
  }
};

export const upgradeLevel = async (level: number) => {
  try {
    const response = await axiosInstance.post('/upgrade/level', {
      timestamp: new Date().valueOf(),
      level: level,
    });
    return response;
  } catch (error) {
    console.error('Error upgrading level:', error);
    throw error;
  }
};