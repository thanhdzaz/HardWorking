/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';

import { LaneFooter } from 'components/Kanban/Trello/styles/Base';

import {
    CollapseBtn,
    ExpandBtn,
} from 'components/Kanban/Trello/styles/Elements';

export default ({ onClick, collapsed }) => <LaneFooter onClick={onClick}>{collapsed ? <ExpandBtn /> : <CollapseBtn />}</LaneFooter>;
