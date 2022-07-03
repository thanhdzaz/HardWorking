/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { AddCardLink } from 'components/Kanban/Trello/styles/Base';

export default function({ onClick, t })
{
    return <AddCardLink onClick={onClick}>{t('Click to add card')}</AddCardLink>;
}
