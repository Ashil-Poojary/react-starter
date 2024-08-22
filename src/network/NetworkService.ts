
import AxiosHelper from "./AxiosHelper";

const getCaseDetail = ({
  draftStatus,
  uniqueId,
  queryParams = null,
}: {
  draftStatus: string;
  uniqueId: string;
  queryParams?: any;
}) => {
  return new Promise((resolve, reject) => {
    AxiosHelper.httpGet({
      path: `case/case-detail/${draftStatus}/${uniqueId}`,
      queryParams: queryParams,
    })
      .then((res: any) => {
        res.isSuccess ? resolve(res.data) : reject(res.description);
      })
      .catch((e) => reject(e));
  });
};





const NetworkService = {
  getCaseDetail,

};

export default NetworkService;
