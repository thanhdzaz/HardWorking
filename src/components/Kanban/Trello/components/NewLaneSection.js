/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { NewLaneSection } from 'components/Kanban/Trello/styles/Base';
import { AddLaneLink } from 'components/Kanban/Trello/styles/Elements';

export default function({ t, onClick })
{
    return (
        <NewLaneSection>
            <AddLaneLink
                t={t}
                onClick={onClick}
            >{t('Add another lane')}
            </AddLaneLink>
        </NewLaneSection>
    );
}
