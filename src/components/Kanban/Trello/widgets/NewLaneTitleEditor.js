/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import PropTypes from 'prop-types';
import { InlineInput } from 'components/Kanban/Trello/styles/Base';
import autosize from 'autosize';

class NewLaneTitleEditor extends React.Component
{
  onKeyDown = (e) =>
  {
      if (e.keyCode === 13)
      {
          if (this.getValue().length === 0)
          {
              this.cancel();
          }
          else
          {
              this.props.onSave(this.getValue);
          }
          e.preventDefault();
      }
      if (e.keyCode === 27)
      {
          this.cancel();
          e.preventDefault();
      }

      if (e.keyCode === 9)
      {
          if (this.getValue().length === 0)
          {
              this.cancel();
          }
          else
          {
              this.props.onSave();
          }
          e.preventDefault();
      }
  };

  cancel = () =>
  {
      this.setValue('');
      this.props.onCancel();
      this.refInput.blur();
  };

  getValue = () => this.refInput.value;

  setValue = (value) => (this.refInput.value = value);

  saveValue = () =>
  {
      if (this.getValue() !== this.props.value)
      {
          this.props.onSave(this.getValue());
      }
  };

  focus = () => this.refInput.focus();

  setRef = (ref) =>
  {
      this.refInput = ref;
      if (this.props.resize !== 'none')
      {
          autosize(this.refInput);
      }
  };

  render()
  {
      const { autoFocus, resize, border, autoResize, value, placeholder } =
      this.props;

      return (
          <header
              style={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  paddingRight: 10,
                  paddingBottom: 6,
                  marginBottom: 10,
                  minWidth: 250,
                  maxHeight: 40,
                  display: 'flex',
                  overflow: 'hidden',
                  flexDirection: 'row',
                  backgroundColor: '#FFFFFF',
              }}
          >
              <span
                  style={{
                      borderTopLeftRadius: 10,
                      width: 9,
                      height: 40,
                      backgroundColor: '#1890FF',
                  }}
              />
              <div
                  style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 5,
                      fontSize: 14,
                      fontWeight: 'bold',
                      width: '90%',
                  }}
              >
                  <InlineInput
                      ref={this.setRef}
                      style={{ resize }}
                      border={border}
                      placeholder={value.length === 0 ? undefined : placeholder}
                      defaultValue={value}
                      rows={3}
                      autoResize={autoResize}
                      autoFocus={autoFocus}
                      onKeyDown={this.onKeyDown}
                      onBlur={this.props.onCancel}
                  />
              </div>
          </header>
      );
  }
}

NewLaneTitleEditor.propTypes = {
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    border: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    autoFocus: PropTypes.bool,
    autoResize: PropTypes.bool,
    resize: PropTypes.oneOf(['none', 'vertical', 'horizontal']),
};

NewLaneTitleEditor.defaultProps = {
    inputRef: () =>
    {},
    onSave: () =>
    {},
    onCancel: () =>
    {},
    placeholder: '',
    value: '',
    border: false,
    autoFocus: false,
    autoResize: false,
    resize: 'none',
};

export default NewLaneTitleEditor;
