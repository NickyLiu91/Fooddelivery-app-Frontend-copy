export const getAddressName = geocode => {
  const addressText = [
    ((geocode.address_components[0] && geocode.address_components[0].short_name) || ''),
    ((geocode.address_components[1] && geocode.address_components[1].short_name) || ''),
    ((geocode.address_components[2] && geocode.address_components[2].short_name) || ''),
    ((geocode.address_components[3] && geocode.address_components[3].short_name) || ''),
  ].join(' ');
  let zip = '';
  if (
    geocode.address_components[7]
    && geocode.address_components[7].types
    && geocode.address_components[7].types.includes('postal_code')
  ) {
    zip = geocode.address_components[7].short_name || '';
    if (
      geocode.address_components[8]
      && geocode.address_components[8].types
      && geocode.address_components[8].types.includes('postal_code_suffix')
    ) {
      zip = `${zip}${geocode.address_components[8].short_name ? `-${geocode.address_components[8].short_name}` : ''}`;
    }
  }
  return `${addressText} ${zip}`;
};
