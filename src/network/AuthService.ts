import AxiosHelper from "./AxiosHelper";



const login = (userData: any) => {
  const body = { username: userData.email, password: userData.password };

  return new Promise((resolve, reject) => {
    AxiosHelper.httpPost({
      path: "auth/sign-in",
      queryParams: null,
      body: body,
    })
      .then((res: any) => resolve({ ...res }))
      .catch((e) => reject(e));
  });
};


const AuthService = {
  login,

};

export default AuthService;
