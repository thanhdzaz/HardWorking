/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-unused-vars */
import Container from 'components/Kanban/Trello/dnd/Container';
import Draggable from 'components/Kanban/Trello/dnd/Draggable';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import PropTypes from 'prop-types';
import { Component } from 'react';
import { PopoverWrapper } from 'react-popopo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as boardActions from 'components/Kanban/Trello/actions/BoardActions';
import * as laneActions from 'components/Kanban/Trello/actions/LaneActions';

import Lane from './Lane';

class BoardContainer extends Component
{
  state = {
      addLaneMode: false,
      createRenderList: [],
  };

  componentDidMount()
  {
      const { actions, eventBusHandle } = this.props;
      actions.loadBoard(this.props.data);
      if (eventBusHandle)
      {
          this.wireEventBus();
      }
  }

  UNSAFE_componentWillReceiveProps(nextProps)
  {
      // nextProps.data changes when external Board input props change and nextProps.reducerData changes due to event bus or UI changes
      const { data, reducerData, onDataChange } = this.props;
      if (nextProps.reducerData && !isEqual(reducerData, nextProps.reducerData))
      {
          onDataChange(nextProps.reducerData);
      }
      if (nextProps.data && !isEqual(nextProps.data, data))
      {
          this.props.actions.loadBoard(nextProps.data);
          onDataChange(nextProps.data);
      }
  }

  get groupName()
  {
      const { id } = this.props;
      return `TrelloBoard${id}`;
  }

  onDragStart = ({ payload }) =>
  {
      const { handleLaneDragStart } = this.props;
      handleLaneDragStart(payload.id);
  };

  onLaneDrop = ({ removedIndex, addedIndex, payload }) =>
  {
      if (
          addedIndex !== 0 &&
      addedIndex !== this.props.reducerData.lanes.length - 1
      )
      {
          const { actions, handleLaneDragEnd } = this.props;
          if (removedIndex !== addedIndex)
          {
              const a = actions.moveLane({
                  oldIndex: removedIndex,
                  newIndex: addedIndex,
              });
              handleLaneDragEnd(
                  removedIndex,
                  addedIndex,
                  payload,
                  this.props.reducerData.lanes,
              );
          }
      }
      else
      {
          // notification.error({
          //     message: i18n._(t`Lỗi`),
          //     description: i18n._(t`Không thể sửa vị trí đầu tiên và kết thúc`),
          //     placement: 'topRight',
          // });
      }
  };

  getCardDetails = (laneId, cardIndex) =>
      this.props.reducerData.lanes.find((lane) => lane.id === laneId).cards[
          cardIndex
      ];

  getLaneDetails = (index) => this.props.reducerData.lanes[index];

  wireEventBus = () =>
  {
      const { actions, eventBusHandle } = this.props;
      const eventBus = {
          publish: (event) =>
          {
              switch (event.type)
              {
                  case 'ADD_CARD':
                      return actions.addCard({ laneId: event.laneId, card: event.card });
                  case 'UPDATE_CARD':
                      return actions.updateCard({
                          laneId: event.laneId,
                          card: event.card,
                      });
                  case 'REMOVE_CARD':
                      return actions.removeCard({
                          laneId: event.laneId,
                          cardId: event.cardId,
                      });
                  case 'REFRESH_BOARD':
                      return actions.loadBoard(event.data);
                  case 'MOVE_CARD':
                      return actions.moveCardAcrossLanes({
                          fromLaneId: event.fromLaneId,
                          toLaneId: event.toLaneId,
                          cardId: event.cardId,
                          index: event.index,
                      });
                  case 'UPDATE_CARDS':
                      return actions.updateCards({
                          laneId: event.laneId,
                          cards: event.cards,
                      });
        
                  case 'UPDATE_LANES':
                      return actions.updateLanes(event.lanes);
                  case 'UPDATE_LANE':
                      return actions.updateLane(event.lane);
                  default:
              }
          },
      };
      eventBusHandle(eventBus);
  };

  // + add
  hideEditableLane = () =>
  {
      this.setState({ addLaneMode: false });
  };

  showEditableLane = () =>
  {
      this.setState({ addLaneMode: true });
  };

  addNewLane = async (params) =>
  {
      this.hideEditableLane();
      const data = await this.props.onLaneAdd(params);
      if (data)
      {
          this.props.actions.addLane({
              id: data,
              title: params.title,
              color: '#904EE2',
              style: {
                  width: 335,
              },
          });
      }
  };

  render()
  {
      const {
          id,
          components,
          reducerData,
          draggable,
          laneDraggable,
          laneDragClass,
          laneDropClass,
          style,
          onDataChange,
          onCardAdd,
          onCardUpdate,
          onCardClick,
          onBeforeCardDelete,
          onCardDelete,
          onLaneScroll,
          onLaneClick,
          onLaneAdd,
          onLaneDelete,
          onLaneUpdate,
          editable,
          canAddLanes,
          laneStyle,
          onCardMoveAcrossLanes,
          t,
          ...otherProps
      } = this.props;

      const { addLaneMode, createRenderList } = this.state;
      // Stick to whitelisting attributes to segregate board and lane props
      const passthroughProps = pick(this.props, [
          'onCardMoveAcrossLanes',
          'onLaneScroll',
          'onLaneDelete',
          'onLaneUpdate',
          'onCardClick',
          'onBeforeCardDelete',
          'onCardDelete',
          'onCardAdd',
          'onCardUpdate',
          'onLaneClick',
          'laneSortFunction',
          'draggable',
          'laneDraggable',
          'cardDraggable',
          'collapsibleLanes',
          'canAddLanes',
          'hideCardDeleteIcon',
          'tagStyle',
          'handleDragStart',
          'handleDragEnd',
          'cardDragClass',
          'editLaneTitle',
          'canAddCard',
          't',
      ]);

      const that = this;
      const laneRenderList = reducerData.lanes.map((lane, index) =>
      {
          const { id, droppable, ...otherProps } = lane;
          const laneToRender = (
              <Lane
                  key={id}
                  boardId={this.groupName}
                  components={components}
                  id={id}
                  getCardDetails={this.getCardDetails}
                  index={index}
                  handleStartCreate={getLaneCreate}
                  droppable={droppable === undefined ? true : droppable}
                  style={laneStyle || lane.style || {}}
                  labelStyle={lane.labelStyle || {}}
                  cardStyle={this.props.cardStyle || lane.cardStyle}
                  editable={editable && !lane.disallowAddingCard}
                  {...otherProps}
                  {...passthroughProps}
              />
          );

          //   return draggable &&
          // laneDraggable &&
          //       ? (
          //               <Draggable key={lane.id}>{laneToRender}</Draggable>
          //           )
          //       : (
          return laneToRender;
          //   ); // control drag lane
      });

      function getLaneCreate(index)
      {
          const a = [...laneRenderList];
          a.splice(
              index,
              0,
              <components.NewLaneForm
                  t={t}
                  onCancel={that.hideEditableLane}
                  onAdd={(data) =>
                      that.addNewLane({
                          ...data,
                          index,
                      })
                  }
              />,
          );
          a.join();
          that.setState({
              createRenderList: a,
              addLaneMode: true,
          });
      }

      return (
          <components.BoardWrapper
              style={style}
              {...otherProps}
              draggable={false}
              title=''
          >
              <PopoverWrapper>
                  <Container
                      title=''
                      orientation="horizontal"
                      dragClass={laneDragClass}
                      dropClass={laneDropClass}
                      lockAxis="x"
                      getChildPayload={(index) => this.getLaneDetails(index)}
                      groupName={this.groupName}
                      onDragStart={this.onDragStart}
                      onDrop={this.onLaneDrop}
                  >
                      {!addLaneMode ? laneRenderList : createRenderList}
                  </Container>
              </PopoverWrapper>
              {editable && !addLaneMode && reducerData.lanes.length === 0 && (
                  <components.NewLaneSection
                      t={t}
                      onClick={() =>
                      {
                          getLaneCreate(0);
                      }}
                  />
              )}
              {/* {canAddLanes && (
          <Container orientation="horizontal">
            {editable && !addLaneMode ? (
              <components.NewLaneSection
                t={t}
                onClick={() => {
                  getLaneCreate(1);
                }}
              />
            ) : (
              // addLaneMode && (
              //   <components.NewLaneForm
              //     onCancel={this.hideEditableLane}
              //     onAdd={(data) =>
              //       this.addNewLane({
              //         ...data,
              //         index: reducerData.lanes.length,
              //       })
              //     }
              //     t={t}
              //   />
              // )
              <>1</>
            )}
          </Container>
        )} */}
          </components.BoardWrapper>
      );
  }
}

BoardContainer.propTypes = {
    id: PropTypes.string,
    components: PropTypes.object,
    actions: PropTypes.object,
    data: PropTypes.object.isRequired,
    reducerData: PropTypes.object,
    onDataChange: PropTypes.func,
    eventBusHandle: PropTypes.func,
    onLaneScroll: PropTypes.func,
    onCardClick: PropTypes.func,
    onBeforeCardDelete: PropTypes.func,
    onCardDelete: PropTypes.func,
    onCardAdd: PropTypes.func,
    onCardUpdate: PropTypes.func,
    onLaneAdd: PropTypes.func,
    onLaneDelete: PropTypes.func,
    onLaneClick: PropTypes.func,
    onLaneUpdate: PropTypes.func,
    laneSortFunction: PropTypes.func,
    draggable: PropTypes.bool,
    collapsibleLanes: PropTypes.bool,
    editable: PropTypes.bool,
    canAddLanes: PropTypes.bool,
    hideCardDeleteIcon: PropTypes.bool,
    handleDragStart: PropTypes.func,
    handleDragEnd: PropTypes.func,
    handleLaneDragStart: PropTypes.func,
    handleLaneDragEnd: PropTypes.func,
    style: PropTypes.object,
    tagStyle: PropTypes.object,
    laneDraggable: PropTypes.bool,
    cardDraggable: PropTypes.bool,
    cardDragClass: PropTypes.string,
    laneDragClass: PropTypes.string,
    laneDropClass: PropTypes.string,
    onCardMoveAcrossLanes: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
};

BoardContainer.defaultProps = {
    t: (v) => v,
    onDataChange: () =>
    {},
    handleDragStart: () =>
    {},
    handleDragEnd: () =>
    {},
    handleLaneDragStart: () =>
    {},
    handleLaneDragEnd: () =>
    {},
    onCardUpdate: () =>
    {},
    onLaneAdd: () =>
    {},
    onLaneDelete: () =>
    {},
    onCardMoveAcrossLanes: () =>
    {},
    onLaneUpdate: () =>
    {},
    editable: false,
    canAddLanes: false,
    hideCardDeleteIcon: false,
    draggable: false,
    collapsibleLanes: false,
    laneDraggable: true,
    cardDraggable: true,
    cardDragClass: 'react_trello_dragClass',
    laneDragClass: 'react_trello_dragLaneClass',
    laneDropClass: '',
};

const mapStateToProps = (state) => (state.lanes ? { reducerData: state } : {});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ ...boardActions, ...laneActions }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
