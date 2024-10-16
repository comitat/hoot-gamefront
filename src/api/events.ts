import axiosInstance from './axiosInstance';

export const getEventsStatuses = async () => {
  try {
    const response = await axiosInstance.get('/event/statuses', {
    });
    return response;
  } catch (error) {
    console.error('Error get events statuses:', error);
    throw error;
  }
};

export const getDailyBonusEval = async () => {
  try {
    const response = await axiosInstance.get('event/daily/eval', {
    });
    return response;
  } catch (error) {
    console.error('Error get daily bonus:', error);
    throw error;
  }
};

export const postDailyBonusClaim = async () => {
  try {
    const response = await axiosInstance.post('event/daily/claim', {
      timestamp: new Date().valueOf(),
    });
    return response;
  } catch (error) {
    console.error('Error posting daily bonus:', error);
    throw error;
  }
};

