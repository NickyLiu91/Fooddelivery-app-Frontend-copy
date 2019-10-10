import HttpModel from './HttpModel';

export default class Crud {
  constructor(entinty) {
    this.entity = entinty;
  }

  getList = params => HttpModel.get(`/${this.entity}`, params);

  getSingle = entityId => HttpModel.get(`/${this.entity}/${entityId}`);

  create = data => HttpModel.post(`/${this.entity}`, data);

  update = (entityId, data) => HttpModel.put(`/${this.entity}/${entityId}`, data);

  delete = entityId => HttpModel.delete(`/${this.entity}/${entityId}`);
}
