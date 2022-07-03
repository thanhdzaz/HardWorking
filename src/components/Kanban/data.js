const cardsLane1 = [];

const cards = (cardsQty) =>
{
    for (let i = 0; i < (cardsQty || 100); i++)
    {
        cardsLane1.push({
            id: i,
            title: `Card ${i}`,
            label: '10 mins',
            description: 'Card',
            priority: 1,
        });
    }
};

cards(10);

export const data = {
    lanes: [
        {
            id: 'PLANNED',
            color: '#1890FF',
            title: 'Khởi tạo',
            style: {
                width: 335,
            },
            cards: cardsLane1,
        },


        {
            id: 'WIP',
            color: '#DD241D',
            title: 'Đang thực hiện',
            style: {
                width: 335,
            },
            cards: [
                {
                    id: 'Wip111',
                    title: 'Clean House',
                    label: '30 mins',
                    description:
            'Soap wash and polish floor. Polish windows and doors. Scrap all broken glasses',
                }
                ,
            ],
        },
        {
            id: 'COMPLETED',
            title: 'Đã hoàn thành',
            style: {
                width: 335,
            },
            label: '2/5',
            color: '#4DB24D',
            cards: [
                {
                    id: 'Completed1',
                    title: 'Practice Meditation',
                    label: '15 mins',
                    description: 'Use Headspace app',
                },
                {
                    id: 'Completed2',
                    title: 'Maintain Daily Journal',
                    label: '15 mins',
                    description: 'Use Spreadsheet for now',
                },
            ],
        },
        {
            id: 'BLOCKED',
            title: 'Quá hạn',
            color: '#F58632',
            style: {
                width: 335,
            },
            cards: [
                {
                    id: 'Wip12',
                    title: 'Clean House 1',
                    label: '30 mins',
                    description:
            'Soap wash and polish floor. Polish windows and doors. Scrap all broken glasses',
                },
            ],
        },
        {
            id: 'BLOCKED2',
            title: 'Quá hạn',
            color: '#F58632',
            style: {
                width: 335,
            },
            cards: [
                {
                    id: 'Wip12',
                    title: 'Clean House 1',
                    label: '30 mins',
                    description:
            'Soap wash and polish floor. Polish windows and doors. Scrap all broken glasses',
                },
            ],
        },
        {
            id: 'BLOCKED3',
            title: 'Quá hạn',
            color: '#F58632',
            style: {
                width: 335,
            },
            cards: [
                {
                    id: 'Wip12',
                    title: 'Clean House 1',
                    label: '30 mins',
                    description:
            'Soap wash and polish floor. Polish windows and doors. Scrap all broken glasses',
                },
            ],
        },
    ],
};
