import { InternalAxiosRequestConfig } from "axios";
import { useEffect } from "react";
import {
  EMAIL_NOT_VERIFIED,
  KEY_X_AUTH_TOKEN,
  KEY_X_REFRESH_TOKEN,
  MOBILE_NOT_VERIFIED,
  SUCCESS_RESPONSE,
} from "../constants/api-constants";
import {
  LSK_REFRESH_TOKEN,
  LSK_TOKEN,
} from "../constants/local-storage-constants";
import SecureStorage from "../utils/SecureStorage";
import rsAxiosInstance from "./AxiosConfig";
import { useUserContext } from "../context/UserContext";
import { ResponseType } from "../model/network";
// import { useSnackbar } from "../context/SnackbarContext";

export const AxiosInterceptor = ({ children }: any) => {
  // open urls to exclude headers and 401 errors
  const OPEN_URL_LIST = [
    "auth/sign-in",
    "auth/sign-up",
    "auth/resend-otp",
    "auth/validate-otp",
    "auth/forgot-password",
    "auth/validate-org-invitation",
    "auth/complete-invitation-signup",
  ];
  const { logout } = useUserContext();

  // const { showSnackbar } = useSnackbar();

  const AUTHENTICATE = "auth/sign-in";
  const REFRESH_TOKEN = "refresh-token";
  const TEMP_TOKEN_URL_LIST = [
    "auth/sign-up",
    "auth/resend-otp",
    "auth/forgot-password",
  ];
  const VALIDATE_OTP = "auth/validate-otp";

  const handleServerError = (error: any) => {
    let message = "";
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.description
    ) {
      message = error.response.data.description;
    } else if (error.message) {
      message = error.message;
    } else {
      message = "Unknown Error";
    }

    // showSnackbar(message);

    return Error(message);
  };

  useEffect(() => {
    let isRefreshing: boolean; // Track whether a token refresh is in progress
    let refreshSubscribers: any[] = []; // Array to hold the pending API requests

    const reqInterceptor = rsAxiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        let token = SecureStorage.getItem(LSK_TOKEN);

        // open url list will be excluded
        if (config && config.url) {
          if (!OPEN_URL_LIST.includes(config.url) && token) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }

          if (config.url && !config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "application/json";
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const resInterceptor = rsAxiosInstance.interceptors.response.use(
      ({ config, data, headers }): any => {
        if (!config || !data)
          return Promise.reject(Error("Something went wrong"));

        if (!config.url) return Promise.reject(Error("Something went wrong"));

        if (data.status === SUCCESS_RESPONSE) {

          switch (config.url) {
            case AUTHENTICATE:
            case VALIDATE_OTP: {
              SecureStorage.setItem(LSK_TOKEN, data.data[KEY_X_AUTH_TOKEN])
              SecureStorage.setItem(LSK_REFRESH_TOKEN, data.data[KEY_X_REFRESH_TOKEN])
              delete data.data[KEY_X_AUTH_TOKEN]
              delete data.data[KEY_X_REFRESH_TOKEN]
              break
            }
            case REFRESH_TOKEN: {
              SecureStorage.setItem(LSK_TOKEN, data.data[KEY_X_AUTH_TOKEN])
              delete data.data[KEY_X_AUTH_TOKEN]
              break
            }
            default:
              break;
          }

          if (TEMP_TOKEN_URL_LIST.includes(config.url)) {
            SecureStorage.setItem(LSK_TOKEN, data.data);
          }

        }

        if (data.status === MOBILE_NOT_VERIFIED || data.status === EMAIL_NOT_VERIFIED) {
          if (config.url === AUTHENTICATE) {
            SecureStorage.setItem(LSK_TOKEN, data.data);
          }
        }

        // In case of file api, return response body as it is
        if (data instanceof ArrayBuffer) {
          return Promise.resolve(data)
        }
        if (data instanceof Blob) {
          return Promise.resolve(data)
        }

        const res = new ResponseType(data);

        if (!res.isSuccess) {
          // showSnackbar(res.description); // handled errors will be shown here
        }

        return Promise.resolve(res);
      },
      async (error) => {
        if (!error.response) {
          return Promise.reject(handleServerError(error));
        }

        const originalRequest = error.config;

        const reqUrl = error.response.config.url;

        if (
          error.response.status === 401 &&
          !originalRequest._retry &&
          reqUrl !== REFRESH_TOKEN &&
          !OPEN_URL_LIST.includes(reqUrl)
        ) {
          originalRequest._retry = true;

          const retryOriginalRequest = new Promise((resolve) => {
            refreshSubscribers.push(() =>
              resolve(rsAxiosInstance(originalRequest))
            );
          });

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const body = {
                refreshToken: SecureStorage.getItem(LSK_REFRESH_TOKEN),
              };

              await rsAxiosInstance.post(REFRESH_TOKEN, body);

              refreshSubscribers.forEach((subscriber) => subscriber());
              refreshSubscribers = [];
            } catch (refreshError: any) {
              logout();
            }

            isRefreshing = false;
          }

          return retryOriginalRequest;
        }

        // Return any other error response
        return Promise.reject(handleServerError(error));
      }
    );

    return () => {
      rsAxiosInstance.interceptors.response.eject(reqInterceptor);
      rsAxiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return children;
};

export default AxiosInterceptor;
