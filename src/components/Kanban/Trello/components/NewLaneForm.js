/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { LaneTitle, Section } from 'components/Kanban/Trello/styles/Base';
import NewLaneTitleEditor from 'components/Kanban/Trello/widgets/NewLaneTitleEditor';
import PropTypes from 'prop-types';
import { Component } from 'react';


class NewLane extends Component
{
  handleSubmit = () =>
  {
      this.props.onAdd({
          id: Math.random() * 100,
          title: this.getValue(),
      });
  };

  getValue = () => this.refInput.getValue();

  onClickOutside = () =>
  {
      if (this.getValue().length > 0)
      {
          this.handleSubmit();
      }
      else
      {
          this.props.onCancel();
      }
  };

  render()
  {
      const { t } = this.props;
      return (
          <Section>
              <LaneTitle>
                  <NewLaneTitleEditor
                      ref={ref => (this.refInput = ref)}
                      placeholder={t('placeholder.title')}
                      resize='vertical'
                      border
                      autoFocus
                      onCancel={this.props.onCancel}
                      onSave={this.handleSubmit}
                  />
              </LaneTitle>
              {/* <NewLaneButtons>
             <AddButton onClick={this.handleSubmit}>{t('button.Add lane')}</AddButton>
            <CancelButton onClick={onCancel}>{t('button.Cancel')}</CancelButton>
          </NewLaneButtons> */}
          </Section>
      );
  }
}

NewLane.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
};

NewLane.defaultProps = {};

export default NewLane;
