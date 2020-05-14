import React from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { SOUNDS_PATHS } from 'constants/audiosPaths';
import { useStyles } from './Settings.styled';
import PropTypes from 'prop-types';
import { createFakeEvent } from 'sdk/utils/forms';

const sounds = [
  {
    id: 1,
    title: 'First sound',
  },
  {
    id: 2,
    title: 'Second sound',
  },
  {
    id: 3,
    title: 'Third sound',
  },
  {
    id: 4,
    title: 'Fourth sound',
  },
  {
    id: 5,
    title: 'Fifth sound',
  },
];

function Player({ soundUrl }) {
  const audio = new Audio(soundUrl);

  const start = () => {
    audio.play();
  };

  return (
    <Button
      onClick={start}
      variant="contained"
      color="primary"
    >
      Play
    </Button>
  );
}

function SettingsCard(props) {
  const {
    currentValue,
    handleChange,
    name,
    headerTitle,
    contentTitle,
  } = props;
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Card className={classes.card}>
        <CardHeader
          title={headerTitle}
          className={classes.cardHeader}
        />
        <CardContent>
          <Box mb={1} mt={1}>
            <Typography>
              {contentTitle}
            </Typography>
          </Box>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label={name}
              name={name}
              id={name}
              value={currentValue}
              onChange={e => handleChange(createFakeEvent({
                name,
                value: e.target.value ? +e.target.value : e.target.value,
              }))}
            >
              {
                sounds.map((item) => (
                  <Grid container direction="row" alignItems="center" key={item.id}>
                    <FormControlLabel value={item.id} control={<Radio />} label={item.title} />
                    <Box m={2}>
                      <Player soundUrl={SOUNDS_PATHS[item.id]} />
                    </Box>
                  </Grid>
                ))
              }
              <FormControlLabel value="" control={<Radio />} label="No sound" />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    </Grid>
  );
}

SettingsCard.propTypes = {
  currentValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  name: PropTypes.string.isRequired,
  headerTitle: PropTypes.string.isRequired,
  contentTitle: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

SettingsCard.defaultProps = {
  currentValue: '',
};

Player.propTypes = {
  soundUrl: PropTypes.string.isRequired,
};

export default connect(null)(SettingsCard);
