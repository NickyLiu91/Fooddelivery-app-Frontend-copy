import React, { Component } from 'react';
import Editor from 'draft-js-plugins-editor';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { listStyles } from '../TermsAndConditions.styled';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import PropTypes from 'prop-types';
import { materialClassesType } from 'types';

const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];

class TextEditor extends Component {
  onChange = editorState => {
    this.props.onChange(this.props.stateName, editorState);
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    const {
      editorState,
      classes,
    } = this.props;

    return (
      <div>
        <div className={classes.editor} onClick={this.focus} role="presentation">
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            plugins={plugins}
            ref={(element) => {
              this.editor = element;
            }}
          />
          <Toolbar />
        </div>
      </div>
    );
  }
}

TextEditor.propTypes = {
  editorState: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]).isRequired,
  classes: materialClassesType.isRequired,
  onChange: PropTypes.func.isRequired,
  stateName: PropTypes.string.isRequired,
};

export default connect(null)(withStyles(listStyles)(TextEditor));
