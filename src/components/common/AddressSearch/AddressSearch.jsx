import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import parse from 'autosuggest-highlight/parse';
import { LoadScript } from '@react-google-maps/api';
import tzlookup from 'tz-lookup';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ENV from 'config/env';
import { Loader } from '..';
import { notifyService } from 'services';
import { getErrorMessage } from 'sdk/utils';
import { getAddressName } from 'sdk/utils/address';

const API_KEY = ENV.REACT_APP_GOOGLE_MAPS_API_KEY;

const autocompleteService = { current: null };
let defaultBounds = null;

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

const libraries = ['places', 'geocoder'];

const propTypes = {
  onChange: PropTypes.func.isRequired,
  errorMsg: PropTypes.string,
  noOptionsText: PropTypes.string,
};

const getTimeZoneData = (place, onChange, geoCode) => {
  try {
    const timeZoneId = tzlookup(geoCode.geometry.location.lat(), geoCode.geometry.location.lng());
    const longName = getAddressName(geoCode);
    onChange({
      long_name: longName,
      short_name: place.structured_formatting.main_text,
      location: {
        lat: geoCode.geometry.location.lat(),
        lng: geoCode.geometry.location.lng(),
      },
      place_id: geoCode.place_id,
      timezone_id: timeZoneId,
    });
  } catch (error) {
    console.log('[handleSetAddress] error', error);
    notifyService.showError(getErrorMessage(error));
  }
};

const getGeoData = (place, onChange) => {
  autocompleteService.geocoder.geocode(
    { placeId: place.place_id },
    geoCode => getTimeZoneData(place, onChange, geoCode[0]),
  );
};


function AddressSearch({
  onChange,
  errorMsg,
  noOptionsText,
}) {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  const handleInputChange = event => {
    setInputValue(event.target.value);
  };

  const handleSetAddress = async value => {
    if (value) {
      try {
        getGeoData(value, onChange);
      } catch (error) {
        console.log('[handleSetAddress] error', error);
        notifyService.showError(getErrorMessage(error));
      }
    }
  };

  const fetch = React.useMemo(
    () =>
      throttle((input, callback) => {
        autocompleteService.current.getPlacePredictions(input, callback);
      }, 200),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      // New-York bounds
      defaultBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(40.488822, -74.257178),
        new window.google.maps.LatLng(40.927086, -73.657050),
      );
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      autocompleteService.geocoder = new window.google.maps.Geocoder();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions([]);
      return undefined;
    }

    fetch({ input: inputValue, bounds: defaultBounds, types: ['address'] }, results => {
      if (active) {
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetch]);

  return (
    <LoadScript
      id="script-loader"
      googleMapsApiKey={API_KEY}
      libraries={libraries}
      loadingElement={<Loader />}
      language="en"
    >
      <Autocomplete
        id="address-search"
        getOptionLabel={option => (typeof option === 'string' ? option : option.structured_formatting.main_text)}
        filterOptions={x => x}
        options={options}
        autoComplete
        includeInputInList
        noOptionsText={noOptionsText}
        onChange={(e, value) => handleSetAddress(value)}
        disableOpenOnFocus
        renderInput={params => (
          <TextField
            {...params}
            error={!!errorMsg}
            helperText={errorMsg}
            label="Search location*"
            placeholder="Start typing..."
            variant="standard"
            fullWidth
            onChange={handleInputChange}
          />
        )}
        renderOption={option => {
          const matches = option.structured_formatting.main_text_matched_substrings;
          const parts = parse(
            option.structured_formatting.main_text,
            matches.map(match => [match.offset, match.offset + match.length]),
          );
          return (
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnIcon className={classes.icon} />
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                    {part.text}
                  </span>
                ))}
                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
      />
    </LoadScript>
  );
}

AddressSearch.propTypes = propTypes;

AddressSearch.defaultProps = {
  errorMsg: null,
  noOptionsText: 'No options',
};

export default AddressSearch;
