import { ReportsApi } from 'sdk/api/';

export class ReportsService {
  static async getGlobalList(params) {
    const { data } = await ReportsApi.getGlobalReportList(params);
    return data;
  }

  static async getStopsList(params) {
    const { data } = await ReportsApi.getStopOrderingList(params);
    return data;
  }

  static async getGeneralFile(params) {
    const { data } = await ReportsApi.getGlobalReportFile(params);
    return data;
  }

  static async getStopsFile(params) {
    const { data } = await ReportsApi.getStopOrderingFile(params);
    return data;
  }
}
