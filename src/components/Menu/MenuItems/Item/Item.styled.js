import { makeStyles } from '@material-ui/core';

export const listStyles = theme => ({
  mainTitle: {
    marginBottom: '24px',
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  chip: {
    width: '100%',
    marginTop: '24px',
  },
  availabilityButton: {
    width: '100%',
    marginTop: '24px',
  },
  fab: {
    marginLeft: '15px',
    marginRight: '15px',
  },
  fieldDays: {
    maxWidth: '80px',
  },
  formControl: {
    width: '100%',
  },
  selectModifiers: {
    width: '60%',
    marginRight: '24px',
  },
  formButton: {
    margin: '8px',
  },
  price: {
    maxWidth: '100px',
    margin: '10px 20px 0 0',
  },
  selectedSection: {
    width: '350px',
    margin: '10px 10px 0 0',
  },
  helperText: {
    color: theme.palette.error.main,
  },
  itemSchedule: {
    border: '1px solid',
    borderColor: theme.palette.grey.A200,
    borderRadius: '5px',
    marginBottom: '10px',
  },
  select: {
    minHeight: '28px',
  },
  outlined: {
    lineHeight: '20px',
  },
  progressContainer: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
  },
});

export const useStyles = makeStyles((theme) => ({
  soldOut: {
    backgroundColor: theme.palette.warning.main,
    width: '100%',
    marginTop: '24px',
  },
  available: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    width: '100%',
    marginTop: '24px',
  },
  archived: {
    width: '100%',
    marginTop: '24px',
  },
  sectionsBadge: {
    margin: '24px',
  },
  sectionItem: {
    border: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: '#fff',
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  sectionList: {
    padding: 0,
  },
  price: {
    marginRight: '72px',
  },
  itemModifier: {
    border: '1px solid',
    borderColor: theme.palette.grey.A200,
    borderRadius: '5px',
    marginBottom: '10px',
  },
  optionsAmount: {
    fontWeight: 600,
  },
  modifierName: {
    color: theme.palette.primary.dark,
  },
}));
