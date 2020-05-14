import { TermsAndConditions } from 'sdk/api/';

export class TermsAndConditionsService {
  static async getTerms() {
    const { data } = await TermsAndConditions.getList();
    return data;
  }

  static async updateTerms(content) {
    const { data } = await TermsAndConditions.create({ content });
    return data;
  }
}
