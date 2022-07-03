/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    MovableCardWrapper,
    CardHeader,
    CardRightContent,
    CardTitle,
    Detail,
    Footer,
} from 'components/Kanban/Trello/styles/Base';
import InlineInput from 'components/Kanban/Trello/widgets/InlineInput';
import DeleteButton from 'components/Kanban/Trello/widgets/DeleteButton';
import Tag from './Card/Tag';

class Card extends Component
{
  onDelete = e =>
  {
      this.props.onDelete();
      e.stopPropagation();
  };

  render()
  {
      const {
          showDeleteButton,
          style,
          tagStyle,
          onClick,
          onChange,
          className,
          id,
          title,
          label,
          description,
          tags,
          cardDraggable,
          editable,
          t,
      } = this.props;

      const updateCard = (card) =>
      {
          onChange({ ...card, id });
      };

      return (
          <MovableCardWrapper
              data-id={id}
              style={style}
              className={className}
              onClick={onClick}
          >
              <CardHeader>
                  <CardTitle draggable={cardDraggable}>
                      {editable
                          ? (
                                  <InlineInput
                                      value={title}
                                      placeholder={t('placeholder.title')}
                                      resize='vertical'
                                      border
                                      onSave={(value) => updateCard({ title: value })}
                                  />
                              )
                          : title}
                  </CardTitle>
                  <CardRightContent>
                      {editable
                          ? (
                                  <InlineInput
                                      value={label}
                                      placeholder={t('placeholder.label')}
                                      resize='vertical'
                                      border
                                      onSave={(value) => updateCard({ label: value })}
                                  />
                              )
                          : label}
                  </CardRightContent>
                  {showDeleteButton && <DeleteButton onClick={this.onDelete} />}
              </CardHeader>
              <Detail>
                  {editable
                      ? (
                              <InlineInput
                                  value={description}
                                  placeholder={t('placeholder.description')}
                                  resize='vertical'
                                  border
                                  onSave={(value) => updateCard({ description: value })}
                              />
                          )
                      : description}
              </Detail>
              {tags && tags.length > 0 && (
                  <Footer>
                      {tags.map(tag => (
                          <Tag
                              key={tag.title}
                              {...tag}
                              tagStyle={tagStyle}
                          />
                      ))}
                  </Footer>
              )}
          </MovableCardWrapper>
      );
  }
}

Card.propTypes = {
    showDeleteButton: PropTypes.bool,
    onDelete: PropTypes.func,
    onClick: PropTypes.func,
    style: PropTypes.object,
    tagStyle: PropTypes.object,
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    label: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.array,
};

Card.defaultProps = {
    showDeleteButton: true,
    onDelete: () =>
    {},
    onClick: () =>
    {},
    style: {},
    tagStyle: {},
    title: 'no title',
    description: '',
    label: '',
    tags: [],
    className: '',
};

export default Card;
