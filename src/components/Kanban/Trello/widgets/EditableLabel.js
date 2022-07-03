/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import PropTypes from 'prop-types';

class EditableLabel extends React.Component
{
    constructor({ value })
    {
        super();
        this.state = { value: value };
    }

  getText = el =>
  {
      return el.innerText;
  };

  onTextChange = ev =>
  {
      const value = this.getText(ev.target);
      this.setState({ value: value });
  };

  componentDidMount()
  {
      if (this.props.autoFocus)
      {
          this.refDiv.focus();
      }
  }

  onBlur = () =>
  {
      this.props.onChange(this.state.value);
  };

  onPaste = ev =>
  {
      ev.preventDefault();
      const value = ev.clipboardData.getData('text');
      document.execCommand('insertText', false, value);
  };

  getClassName = () =>
  {
      const placeholder = this.state.value === '' ? 'comPlainTextContentEditable--has-placeholder' : '';
      return `comPlainTextContentEditable ${placeholder}`;
  };

  onKeyDown = (e) =>
  {
      if (e.keyCode === 13)
      {
      // this.props.onChange(this.state.value)
          this.props.onConfirm(this.state.value);
          e.preventDefault();
      }
      if (e.keyCode === 27)
      {
          this.refDiv.value = this.props.value;
          this.setState({ value: this.props.value });
          // this.refDiv.blur()
          e.preventDefault();
          e.stopPropagation();
      }
  };

  render()
  {
      const placeholder = this.props.value.length > 0 ? false : this.props.placeholder;
      return (
          <div
              ref={ref => (this.refDiv = ref)}
              contentEditable="true"
              className={this.getClassName()}
              placeholder={placeholder}
              onPaste={this.onPaste}
              onBlur={this.props.onBlur}
              onInput={this.onTextChange}
              onKeyDown={this.onKeyDown}
          />
      );
  }
}

EditableLabel.propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    inline: PropTypes.bool,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    onConfirm: PropTypes.func,
};

EditableLabel.defaultProps = {
    onChange: () =>
    {},
    placeholder: '',
    autoFocus: false,
    inline: false,
    value: '',
    onBlur: ()=>
    {},
    onConfirm: () =>
    {},
};
export default EditableLabel;
