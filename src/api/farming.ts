import axiosInstance from './axiosInstance';

export const postCreateFarming = async (amount: number, token: string, eventSlug?: string) => {
  try {
    const response = await axiosInstance.post('/farming/create', {
      // timestamp: new Date().valueOf(),
      amount,
      token,
      eventSlug,
    });
    return response;
  } catch (error) {
    console.error('Error creating farm:', error);
    throw error;
  }
};

export const getFarmingAll = async () => { // isActive = true, isEnded = true
  try {
    const response = await axiosInstance.post('/farming/get', {
      // timestamp: new Date().valueOf(),
    });
    return response;
  } catch (error) {
    console.error('Error get farming all:', error);
    throw error;
  }
};

export const stopFarming = async (farmId: string) => {
  try {
    const response = await axiosInstance.get('/farming/stop/' + farmId, {
      // timestamp: new Date().valueOf(),
    });
    return response;
  } catch (error) {
    console.error('Error stop farming:', error);
    throw error;
  }
};


export const getAccountData = async () => {
  try {
    const response = await axiosInstance.get('/account/me/', {
      // timestamp: new Date().valueOf(),
    });
    return response;
  } catch (error) {
    console.error('Error get account data:', error);
    throw error;
  }
};
