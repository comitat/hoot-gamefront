import axiosInstance from './axiosInstance';

export const postMiningTap = async (count: number) => {
  try {
    const response = await axiosInstance.post('/mining/tap', {
      timestamp: new Date().valueOf(),
      count,
    });
    return response;
  } catch (error) {
    console.error('Error posting taps:', error);
    throw error;
  }
};

export const postMiningInit = async () => {
  try {
    const response = await axiosInstance.post('/mining/init', {
      timestamp: new Date().valueOf(),
    });
    return response;
  } catch (error) {
    console.error('Error posting init:', error);
    throw error;
  }
};

export const startAutoMining = async (duration: number) => {
  try {
    const response = await axiosInstance.post('/mining/auto:start', {
      timestamp: new Date().valueOf(),
      duration,
    });
    return response;
  } catch (error) {
    console.error('Error start automining init:', error);
    throw error;
  }
};

export const stopAutoMining = async () => {
  try {
    const response = await axiosInstance.post('/mining/auto:stop', {
      timestamp: new Date().valueOf(),
    });
    return response;
  } catch (error) {
    console.error('Error stop automining init:', error);
    throw error;
  }
};
