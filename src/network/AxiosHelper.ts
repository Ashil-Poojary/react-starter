import {
  FileUploadParams,
  HttpGetParam,
  HttpPostParam,
} from "../model/network";
import rsAxiosInstance from "./AxiosConfig";

const httpGet = ({ path, queryParams = null }: HttpGetParam) => {
  return new Promise((resolve, reject) => {
    rsAxiosInstance
      .get(path, {
        headers: {
          "Content-Type": "application/json",
        },
        params: queryParams,
      })
      .then((res) => {
        return resolve(res);
      })
      .catch((e) => {
        console.error(e.message);
        reject(e.message);
      }); //TODO : send formatted message
  });
};

const httpPost = ({ path, queryParams = null, body = null }: HttpPostParam) => {
  return new Promise((resolve, reject) => {
    rsAxiosInstance
      .post(path, body, {
        headers: {
          "Content-Type": "application/json",
        },
        params: queryParams,
      })
      .then((res) => {
        return resolve(res);
      })
      .catch((e) => {
        console.error(e);
        reject(e.message);
      }); //TODO : send formatted message
  });
};

const fileUpload = ({ path, body }: FileUploadParams) => {
  return new Promise((resolve, reject) => {
    rsAxiosInstance
      .post(path, body, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res: any) => {
        return res.isSuccess
          ? resolve(res.data)
          : reject("Something went wrong");
      })
      .catch((e) => {
        console.log(e);
        reject(e.message);
      });
  });
};

//TODO: take accept type as param and specify required accept type and content type - Wilson
const getFile = (path: string) => {
  return new Promise((resolve, reject) => {
    rsAxiosInstance
      .get(path, {
        responseType: "arraybuffer",
        responseEncoding: "",
        headers: {
          "Content-Type": "application/*",
          Accept: "*/*",
        },
      })
      .then((res: any) => {
        return resolve(res);
      })
      .catch((e) => {
        console.log(e);
        reject(e.message);
      });
  });
};
const getFileBlob = (path: string) => {
  return new Promise((resolve, reject) => {
    rsAxiosInstance
      .get(path, {
        responseType: "blob",
        // responseEncoding: "",
        headers: {
          "Content-Type": "*",
          Accept: "*/*",
        },
      })
      .then((res: any) => {
        return resolve(res);
      })
      .catch((e) => {
        console.log(e);
        reject(e.message);
      });
  });
};

/*
    TODO: 
        image/file get helper   
        image/file upload helper
*/

const AxiosHelper = {
  httpGet,
  httpPost,
  fileUpload,
  getFile,
  getFileBlob,
};

export default AxiosHelper;
