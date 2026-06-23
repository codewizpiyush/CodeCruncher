import axiosInstance from "../apicalls/index";

export const registerUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/register', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const loginUser = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/users/login', payload);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getUserInfo = async () => {
    try {
        const response = await axiosInstance.post('/api/users/get-user-info');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

// Fetch all users
export const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/users/get-all-users");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
};
  
// Update user's block/unblock status
export const updateUserStatus = async (userId, isBlocked) => {
  try {
    const response = await axiosInstance.post("/api/users/update-user-status", {
      userId,
      isBlocked,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
