import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    withCredentials: true, // Automatically sends cookies with every request
});

// Response Interceptor – Handles Token Expiry
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Ignore all requests related to authentication
        if (originalRequest.url?.includes("/auth")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Refresh token request (cookies will be sent automatically)
                const response = await api.post("/auth/refresh-token", {}, { withCredentials: true });

                // Extract the new access token from the response
                const newAccessToken = response.data?.accessToken;

                if (newAccessToken) {
                    // Update the Authorization header
                    api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                }

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                console.log("refreshErr: ", refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
