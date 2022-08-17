/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable multiline-ternary */
/* eslint-disable no-unused-vars */
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './index.less';

import Container from 'components/Kanban/Trello/dnd/Container';
import Draggable from 'components/Kanban/Trello/dnd/Draggable';

import { Modal, notification } from 'antd';
import * as laneActions from 'components/Kanban/Trello/actions/LaneActions';

class Lane extends Component
{
  state = {
      loading: false,
      currentPage: this.props.currentPage,
      addCardMode: false,
      collapsed: false,
      isDraggingOver: false,
  };

  handleScroll = (evt) =>
  {
      const node = evt.target;
      const elemScrollPosition =
      node.scrollHeight - node.scrollTop - node.clientHeight;
      const { onLaneScroll } = this.props;
      // In some browsers and/or screen sizes a decimal rest value between 0 and 1 exists, so it should be checked on < 1 instead of < 0
      if (elemScrollPosition < 1 && onLaneScroll && !this.state.loading)
      {
          const { currentPage } = this.state;
          this.setState({ loading: true });
          const nextPage = currentPage + 1;
          onLaneScroll(nextPage, this.props.id).then((moreCards) =>
          {
              if ((moreCards || []).length > 0)
              {
                  this.props.actions.paginateLane({
                      laneId: this.props.id,
                      newCards: moreCards,
                      nextPage,
                  });
              }
              this.setState({ loading: false });
          });
      }
  };

  sortCards(cards, sortFunction)
  {
      if (!cards)
      {
          return [];
      }
      if (!sortFunction)
      {
          return cards;
      }
      return cards.concat().sort(function (card1, card2)
      {
          return sortFunction(card1, card2);
      });
  }

  laneDidMount = (node) =>
  {
      if (node)
      {
          node.addEventListener('scroll', this.handleScroll);
      }
  };

  UNSAFE_componentWillReceiveProps(nextProps)
  {
      if (!isEqual(this.props.cards, nextProps.cards))
      {
          this.setState({
              currentPage: nextProps.currentPage,
          });
      }
  }

  removeCard = (cardId) =>
  {
      if (
          this.props.onBeforeCardDelete &&
      typeof this.props.onBeforeCardDelete === 'function'
      )
      {
          this.props.onBeforeCardDelete(() =>
          {
              this.props.onCardDelete &&
          this.props.onCardDelete(cardId, this.props.id);
              this.props.actions.removeCard({ laneId: this.props.id, cardId });
          });
      }
      else
      {
          this.props.onCardDelete && this.props.onCardDelete(cardId, this.props.id);
          this.props.actions.removeCard({ laneId: this.props.id, cardId });
      }
  };

  handleCardClick = (e, card) =>
  {
      const { onCardClick } = this.props;
      onCardClick && onCardClick(card.id, card.metadata, card.laneId);
      e.stopPropagation();
  };

  showEditableCard = () =>
  {
      this.setState({ addCardMode: true });
  };

  hideEditableCard = () =>
  {
      this.setState({ addCardMode: false });
  };

  addNewCard = (params) =>
  {
      const laneId = this.props.id;
      const id = Math.random() * 100;
      const card = { id, ...params };
      const a = this.props.onCardAdd(card, laneId);

      a.then(({ data: d, priority }) =>
      {
          if (d?.id)
          {
              console.log();
              this.hideEditableCard();
              this.props.actions.addCard({
                  laneId,
                  card: {
                      ...card,
                      id: d.id,
                      priority,
                      status: '0',
                      type: '0',
                  },
              });
          }
          else
          {
              notification.error({ message: 'Card added error' });
          }
      });
  };

  onDragStart = ({ payload }) =>
  {
      const { handleDragStart } = this.props;
      handleDragStart && handleDragStart(payload.id, payload.laneId);
  };

  shouldAcceptDrop = (sourceContainerOptions) =>
      this.props.droppable && sourceContainerOptions.groupName === this.groupName;

  get groupName()
  {
      const { boardId } = this.props;
      return `TrelloBoard${boardId}Lane`;
  }

  onDragEnd = (laneId, result) =>
  {
      const { handleDragEnd } = this.props;
      const { addedIndex, payload } = result;
      const lane = this.props.reducerData.lanes.find(
          (l) => l.id.toString() === laneId.toString(),
      );
      const index = this.props.reducerData.lanes.indexOf(lane);
      let newStatus = 0;

      if (this.state.isDraggingOver)
      {
          this.setState({ isDraggingOver: false });
      }

      if (addedIndex != null)
      {
          const newCard = { ...cloneDeep(payload), laneId };
          const response = handleDragEnd
              ? handleDragEnd(payload.id, payload.laneId, laneId, addedIndex, newCard)
              : true;
          if (response === undefined || !!response)
          {
              this.props.actions.moveCardAcrossLanes({
                  fromLaneId: payload.laneId,
                  toLaneId: laneId,
                  cardId: payload.id,
                  index: addedIndex,
              });
              if (index > 0 && index < this.props.reducerData.lanes.length - 1)
              {
                  newStatus = 1;
              }

              if (index === 0)
              {
                  newStatus = 0;
              }

              if (index === this.props.reducerData.lanes.length - 1)
              {
                  newStatus = 2;
              }

              this.props.onCardMoveAcrossLanes(
                  payload.laneId,
                  laneId,
                  payload.id,
                  addedIndex,
                  newStatus,
              );
          }
          return response;
      }
  };

  updateCard = (updatedCard) =>
  {
      this.props.onCardUpdate(this.props.id, updatedCard);
      this.props.actions.updateCard({ laneId: this.props.id, card: updatedCard });
  };

  renderDragContainer = (isDraggingOver) =>
  {
      const {
          id,
          cards,
          laneSortFunction,
          editable,
          hideCardDeleteIcon,
          cardDraggable,
          cardDragClass,
          cardDropClass,
          tagStyle,
          cardStyle,
          components,
          t,
      } = this.props;

      const { addCardMode, collapsed } = this.state;

      const showableCards = collapsed ? [] : cards;

      const cardList = this.sortCards(showableCards, laneSortFunction).map(
          (card, idx) =>
          {
              const onDeleteCard = () => this.removeCard(card.id);
              const cardToRender = (
                  <components.Card
                      key={card.id}
                      index={idx}
                      style={card.style || cardStyle}
                      className="react-trello-card"
                      showDeleteButton={!hideCardDeleteIcon}
                      tagStyle={tagStyle}
                      cardDraggable={cardDraggable}
                      t={t}
                      editable
                      onDelete={onDeleteCard} // control drag card
                      onClick={(e) => this.handleCardClick(e, card)}
                      onChange={(updatedCard) => this.updateCard(updatedCard)}
                      {...card}
                  />
              );
              return cardDraggable &&
          (!card.hasOwnProperty('draggable') || card.draggable) ? ( // control drag card
                          <Draggable key={card.id}>{cardToRender}</Draggable>
                      ) : (
                          <span key={card.id}>{cardToRender}</span>
                      );
          },
      );

      return (
          <components.ScrollableLane
              ref={this.laneDidMount}
              isDraggingOver={isDraggingOver}
          >
              <Container
                  orientation="vertical"
                  groupName={this.groupName}
                  dragClass={cardDragClass}
                  dropClass={cardDropClass}
                  shouldAcceptDrop={this.shouldAcceptDrop}
                  getChildPayload={(index) => this.props.getCardDetails(id, index)}
                  onDragStart={this.onDragStart}
                  onDrop={(e) => this.onDragEnd(id, e)}
                  onDragEnter={() => this.setState({ isDraggingOver: true })}
                  onDragLeave={() => this.setState({ isDraggingOver: false })}
              >
                  {cardList}
                  {addCardMode && (
                      <components.NewCardForm
                          t={t}
                          laneId={id}
                          onCancel={this.hideEditableCard}
                          onAdd={this.addNewCard}
                      />
                  )}
              </Container>
              {/* {editable && !addCardMode && (
          <components.AddCardLink
            onClick={this.showEditableCard}
            t={t}
            laneId={id}
          />
        )} */}
          </components.ScrollableLane>
      );
  };

  removeLane = () =>
  {
      const { id, cards, title } = this.props;
      console.log(this.props);
      if (cards.length > 0)
      {
          Modal.confirm({
              onOk: () =>
              {
                  this.props.actions.removeLane({ laneId: id });
                  this.props.onLaneDelete(id);
              },
              title: 'Cảnh báo',
              content: `Trong nhóm ${title} đang có ${cards.length} nhiệm vụ, bạn có chắc muốn xóa?`,
              type: 'warning',
              okText: 'Xóa',
              okButtonProps: {
                  style: { backgroundColor: 'red', border: '1px solid red' },
              },
          });
      }
      else
      {
          this.props.actions.removeLane({ laneId: id });
          this.props.onLaneDelete(id);
      }
  };

  updateTitle = (value) =>
  {
      this.props.actions.updateLane({ id: this.props.id, title: value });
      this.props.onLaneUpdate(this.props.id, { title: value });
  };

  changeColor = (value) =>
  {
      this.props.actions.updateLane({ id: this.props.id, color: value });
      this.props.onLaneUpdate(this.props.id, { color: value });
  };

  renderHeader = (pickedProps) =>
  {
      const { components, handleStartCreate } = this.props;
      return (
          <components.LaneHeader
              {...pickedProps}
              updateTitle={this.updateTitle}
              changeColor={this.changeColor}
              handleStartCreate={handleStartCreate}
              onDelete={this.removeLane}
              onDoubleClick={this.toggleLaneCollapsed}
          />
      );
  };

  toggleLaneCollapsed = () =>
  {
      this.props.collapsibleLanes &&
      this.setState((state) => ({ collapsed: !state.collapsed }));
  };

  render()
  {
      const { loading, isDraggingOver, collapsed } = this.state;
      const {
          id,
          cards,
          collapsibleLanes,
          components,
          onLaneClick,
          onLaneScroll,
          onCardClick,
          onCardAdd,
          onBeforeCardDelete,
          onCardDelete,
          onLaneDelete,
          handleStartCreate,
          onLaneUpdate,
          onCardUpdate,
          onCardMoveAcrossLanes,
          editable,
          canAddCard,
          t,
          ...otherProps
      } = this.props;
      const allClassNames = classNames(
          'react-trello-lane',
          this.props.className || '',
      );
      const { addCardMode } = this.state;

      //   console.log(canAddCard, '????');
      const showFooter = collapsibleLanes && cards.length > 0;
      return (
          <components.Section
              {...otherProps}
              key={id}
              draggable={false}
              className={allClassNames}
              title=''
              onClick={() => onLaneClick && onLaneClick(id)}
          >
              {this.renderHeader({ id, cards, ...otherProps })}
              {this.renderDragContainer(isDraggingOver)}
              {loading && <components.Loader />}
              {showFooter && (
                  <components.LaneFooter
                      collapsed={collapsed}
                      onClick={this.toggleLaneCollapsed}
                  />
              )}
              {canAddCard && editable && !addCardMode && (
                  <components.AddCardLink
                      t={t}
                      laneId={id}
                      onClick={this.showEditableCard}
                  />
              )}
          </components.Section>
      );
  }
}

Lane.propTypes = {
    actions: PropTypes.object,
    id: PropTypes.string.isRequired,
    boardId: PropTypes.string,
    title: PropTypes.node,
    index: PropTypes.number,
    laneSortFunction: PropTypes.func,
    style: PropTypes.object,
    cardStyle: PropTypes.object,
    tagStyle: PropTypes.object,
    titleStyle: PropTypes.object,
    labelStyle: PropTypes.object,
    cards: PropTypes.array,
    label: PropTypes.string,
    currentPage: PropTypes.number,
    draggable: PropTypes.bool,
    collapsibleLanes: PropTypes.bool,
    droppable: PropTypes.bool,
    onCardMoveAcrossLanes: PropTypes.func,
    onCardClick: PropTypes.func,
    onBeforeCardDelete: PropTypes.func,
    onCardDelete: PropTypes.func,
    onCardAdd: PropTypes.func,
    onCardUpdate: PropTypes.func,
    onLaneDelete: PropTypes.func,
    onLaneUpdate: PropTypes.func,
    onLaneClick: PropTypes.func,
    onLaneScroll: PropTypes.func,
    editable: PropTypes.bool,
    laneDraggable: PropTypes.bool,
    cardDraggable: PropTypes.bool,
    cardDragClass: PropTypes.string,
    cardDropClass: PropTypes.string,
    canAddLanes: PropTypes.bool,
    t: PropTypes.func.isRequired,
};

Lane.defaultProps = {
    style: {},
    titleStyle: {},
    labelStyle: {},
    label: undefined,
    editable: false,
    onLaneUpdate: () =>
    {},
    onCardAdd: () =>
    {},
    onCardUpdate: () =>
    {},
};

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(laneActions, dispatch),
});

const mapStateToProps = (state) => (state.lanes ? { reducerData: state } : {});

export default connect(mapStateToProps, mapDispatchToProps)(Lane);
