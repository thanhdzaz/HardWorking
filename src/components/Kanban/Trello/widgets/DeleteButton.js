/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { DeleteWrapper, DelButton } from 'components/Kanban/Trello/styles/Elements';

const DeleteButton = (props) =>
{
    return (
        <DeleteWrapper {...props}>
            <DelButton>&#10006;</DelButton>
        </DeleteWrapper>
    );
};

export default DeleteButton;
