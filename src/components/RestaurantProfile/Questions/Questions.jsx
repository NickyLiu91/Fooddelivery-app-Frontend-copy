import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import QuestionDeleteDialog from './QuestionDeleteDialog';
import QuestionEditDialog from './QuestionEditDialog';
import QuestionAddDialog from './QuestionAddDialog';
import parse from 'html-react-parser';
import { useStyles } from '../RestaurantProfile.styled';

function Questions(props) {
  const {
    defaultData,
    handleSubmitAdd,
    isOpen,
    closeHandler,
    openHandler,
    isOpenDeleteDialog,
    questionToDelete,
    deleting,
    handleDeleteClose,
    handleDeleteConfirm,
    handleDelete,
    isOpenEditDialog,
    questionToEdit,
    handleQuestionEdit,
    handleEdit,
  } = props;
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title="FAQ"
          className={classes.cardHeader}
        />
        <CardContent>
          <Button
            size="small"
            color="primary"
            variant="contained"
            className={classes.addButton}
            onClick={openHandler}
          >
            Add Question
          </Button>
          {
            defaultData.questions.map((item) => (
              <ExpansionPanel key={item.question}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6">{item.question}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div>
                    {(item.answer) ? parse(item.answer) : ''}
                  </div>
                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                  <Grid container>
                    <Grid item>
                      <Tooltip title="Edit" onClick={() => handleEdit(item)}>
                        <IconButton aria-label="edit">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Delete" onClick={() => handleDelete(item)}>
                        <IconButton aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </ExpansionPanelActions>
              </ExpansionPanel>
            ))}
        </CardContent>
      </Card>
      <QuestionDeleteDialog
        isOpen={isOpenDeleteDialog}
        handleDeleteClose={handleDeleteClose}
        handleDeleteConfirm={handleDeleteConfirm}
        questionToDelete={questionToDelete}
        deleting={deleting}
      />
      <QuestionEditDialog
        isOpen={isOpenEditDialog}
        handleEditClose={closeHandler}
        submitHandler={handleQuestionEdit}
        questionToEdit={questionToEdit}
        handleEdit={handleEdit}
      />
      <QuestionAddDialog
        isOpen={isOpen}
        submitHandler={handleSubmitAdd}
        closeHandler={closeHandler}
      />
    </Grid>
  );
}

Questions.defaultProps = {
  questionToDelete: null,
};

Questions.propTypes = {
  handleSubmitAdd: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenDeleteDialog: PropTypes.bool.isRequired,
  questionToDelete: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(null),
  ]),
  deleting: PropTypes.bool.isRequired,
  handleDeleteClose: PropTypes.func.isRequired,
  handleDeleteConfirm: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isOpenEditDialog: PropTypes.bool.isRequired,
  questionToEdit: PropTypes.oneOfType([
    PropTypes.object,
  ]).isRequired,
  handleQuestionEdit: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  defaultData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]).isRequired,
};

export default connect(null)(Questions);
