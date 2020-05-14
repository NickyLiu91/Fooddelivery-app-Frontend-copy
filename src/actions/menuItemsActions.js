import { SELECTED_SECTION } from 'constants/actions/menuItems';

export const setSelectedSection = (section) => ({
  type: SELECTED_SECTION,
  payload: { section },
});
