/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { LoaderDiv, LoadingBar } from 'components/Kanban/Trello/styles/Loader';

function Loader()
{
    return (
        <LoaderDiv>
            <LoadingBar />
            <LoadingBar />
            <LoadingBar />
            <LoadingBar />
        </LoaderDiv>
    );
}

export default Loader;
