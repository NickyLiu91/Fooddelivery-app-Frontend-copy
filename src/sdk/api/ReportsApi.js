import HttpModel from './HttpModel';
import { Crud } from '.';
import { REPORTS_PATH } from 'constants/apiPaths';
import { formQueryString } from 'sdk/utils';

class ReportsApi extends Crud {
  constructor() {
    super(REPORTS_PATH);
  }

  getGlobalReportList = (params) => HttpModel.get(`${REPORTS_PATH}/general/data${formQueryString(params)}`);

  getStopOrderingList = (params) => HttpModel.get(`${REPORTS_PATH}/stop-ordering/data${formQueryString(params)}`);

  getGlobalReportFile = (params) => HttpModel.getFile(`${REPORTS_PATH}/general/file${formQueryString(params)}`);

  getStopOrderingFile = (params) => HttpModel.getFile(`${REPORTS_PATH}/stop-ordering/file${formQueryString(params)}`);
}

export default new ReportsApi();
