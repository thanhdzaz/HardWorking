/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
    CardForm, CardTitle,
    CardWrapper,
} from 'components/Kanban/Trello/styles/Base';
import EditableLabel from 'components/Kanban/Trello/widgets/EditableLabel';
import PropTypes from 'prop-types';
import { Component } from 'react';

class NewCardForm extends Component
{
  updateField = (field, value) =>
  {
      this.setState({ [field]: value });
  };

  handleAdd = (val) =>
  {
      this.props.onAdd({ title: val });
  };

  render()
  {
      const { onCancel, t } = this.props;
      console.log(this.state);
      return (
          <CardForm>
              <CardWrapper>
                  <CardTitle>
                      <EditableLabel
                          placeholder={t('placeholder.title')}
                          autoFocus
                          onChange={(val) => this.updateField('title', val)}
                          onBlur={onCancel}
                          onConfirm={this.handleAdd}
                      />
                  </CardTitle>
                  {/* <CardRightContent>
              <EditableLabel placeholder={t('placeholder.label')} onChange={val => this.updateField('label', val)} />
            </CardRightContent>

          <Detail>
            <EditableLabel placeholder={t('placeholder.description')} onChange={val => this.updateField('description', val)} />
          </Detail> */}
              </CardWrapper>
              {/* <AddButton onClick={this.handleAdd}>{t("button.Add card")}</AddButton>
        <CancelButton onClick={onCancel}>{t("button.Cancel")}</CancelButton> */}
          </CardForm>
      );
  }
}

NewCardForm.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
};

NewCardForm.defaultProps = {};

export default NewCardForm;
