/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import classNames from 'classnames';
import boardReducer from 'components/Kanban/Trello/reducers/BoardReducer';
import { Component } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import BoardContainer from './BoardContainer';

const middlewares = process.env.REDUX_LOGGING ? [logger] : [];

export default class Board extends Component
{
    constructor({ id })
    {
        super();
        this.store = this.getStore();
        this.id = id || Math.random() * 100;
    }

  getStore = () =>
  // When you create multiple boards, unique stores are created for isolation
      createStore(boardReducer, applyMiddleware(...middlewares));

  render()
  {
      const { className, components } = this.props;
      const allClassNames = classNames('react-trello-board', className || '');
      return (
          <Provider store={this.store}>
              <>
                  <components.GlobalStyle />
                  <BoardContainer
                      id={this.id}
                      {...this.props}
                      className={allClassNames}
                  />
              </>
          </Provider>
      );
  }
}
