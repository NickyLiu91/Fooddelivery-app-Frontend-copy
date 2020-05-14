import { SELECTED_SECTION } from 'constants/actions/menuItems';

const initialState = {
  name: '',
  menu_items_count: 0,
  items: [],
  id: null,
  sections: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SELECTED_SECTION:
      return {
        ...state,
        name: payload.section.name,
        menu_items_count: payload.section.menu_items_count,
        id: payload.section.id,
        sections: payload.section.sections,
      };
    default:
      return state;
  }
};
