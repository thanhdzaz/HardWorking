/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-promise-executor-return */
/* eslint-disable react/sort-comp */
import { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import './theme.css';

import ReactDOMServer from 'react-dom/server';
import MyTooltipContent from './Tooltip';
import { DATE, LABELS } from './locale';
import './index.less';
import { TaskCells } from './TaskCel';
// import Notify from 'components/Notify';

// const textEditor = { type: 'text', map_to: 'text' };
// const dateEditor = { type: 'date', map_to: 'start_date', min: new Date(2020, 0, 1),
//     max: new Date(2025, 0, 1) };
// const durationEditor = { type: 'number', map_to: 'duration', min: 0, max: 100 };

class GanttTemplate extends Component
{
    componentDidMount()
    {
        gantt.skin = 'material';
        gantt.plugins({
            tooltip: true,
        });

        gantt.init(this.ganttContainer);
        gantt.parse(this.props.tasks);

        gantt.locale.labels = LABELS;
        gantt.locale.date = DATE;
        gantt.config.columns = [
            { name: 'text', width: '*', min_width: 110, tree: true }, // ,editor: textEditor
            // {
            //   name: "start_date",
            //   lalign: "flex-end",
            //   template(obj) {
            //     return moment(obj.start_date).format("DD-MM-yyyy");
            //   },
            //   width: 100,
            // }, // ,editor: dateEditor
            {
                name: 'progress', align: 'center', width: 70, template(obj)
                {
                    return `${Math.floor(obj.progress)}%`;
                },
            }, // ,editor: durationEditor
            // {
            //   name: "buttons",
            //   align: "center",
            //   label: "<i class=\"fa fa-plus\" data-action=\"add\"></i>",
            //   width: 75,
            //   template() {
            //     return "<i class=\"fa fa-plus\" data-action=\"add\"></i>";
            //   },
            // },
        ];

        gantt.templates.task_text = (start, end, task) =>
        {
            console.log(task);
            return ReactDOMServer.renderToString(
                <TaskCells
                    task={task}
                />,
            );
        };


        gantt.config.drag_move = false;
        gantt.config.drag_progress = false;
        gantt.config.drag_project = false;
        gantt.config.drag_timeline = false;
        gantt.config.drag_resize = false;

        gantt.config.layout = {
            css: 'gantt_container',
            rows: [
                {
                    cols: [
                        { view: 'grid', scrollX: 'barrrrr', scrollY: 'hehe' },
                        { view: 'timeline', scrollX: 'barrrrr', scrollY: 'hehe' },
                        { view: 'scrollbar', id: 'hehe' },
                    ],
                },
                { view: 'scrollbar', scroll: 'x', id: 'barrrrr' },
            ],
        };
        // gantt.resizeLightbox();

        gantt.attachEvent('onTaskClick', (id, e) =>
        {
            const button = e.target.closest('[data-action]');

            if (button)
            {
                const action = button.getAttribute('data-action');
                switch (action)
                {
                    case 'edit':
                        gantt.showLightbox(id);
                        break;
                    case 'add':
                        this.props.setIdParent(id);
                        break;
                    case 'delete':
                        gantt.confirm({
                            title: gantt.locale.labels.confirm_deleting_title,
                            text: gantt.locale.labels.confirm_deleting,
                        });
                        break;
                    default: break;
                }
                return false;
            }
            return true;
        });
        gantt.templates.tooltip_text = function (_start, _end, _task)
        {
            return ReactDOMServer.renderToString(<MyTooltipContent data={_task} />);
        };

        this.initZoom();
        this.setZoom(this.props.zoom);
        this.initGanttDataProcessor();
        gantt.attachEvent('onTaskDblClick', (id, _e) =>
        {
            setTimeout(() =>
            {
                this.props.onUpdateOpen(id);

            }, 0);
            return false;
        });
        gantt.render();
    }

    componentWillUnmount()
    {
        if (this.dataProcessor)
        {
            this.dataProcessor.destructor();
            this.dataProcessor = null;
        }
        gantt.clearAll();
    }

    initGanttDataProcessor()
    {
        const { onDataUpdated } = this.props;
        this.dataProcessor = gantt.createDataProcessor(
            (entityType, action, item, id) =>
                new Promise((resolve, _reject) =>
                {
                    if (onDataUpdated)
                    {
                        gantt.render();
                        // Notify('success',`Bạn vừa ${action} vào id: ${id}`);
                        onDataUpdated(entityType, action, item, id);
                    }
                    return resolve();
                }),
        );
    }

    setZoom(value)
    {
        if (!gantt.$initialized)
        {
            this.initZoom();
        }
        gantt?.ext?.zoom?.setLevel(value);
    }

    shouldComponentUpdate(nextProps)
    {
        if (
            nextProps.task !== this.props.task ||
      nextProps.zoom !== this.props.zoom
        )
        {
            return true;
        }
        return false;
    }

    componentDidUpdate()
    {
        this.setZoom(this.props.zoom);
    }

    initZoom()
    {
        gantt.ext.zoom.init({
            levels: [
                {
                    name: 'Hours',
                    scale_height: 60,
                    min_column_width: 30,
                    scales: [
                        { unit: 'day', step: 1, format: '%d %M' },
                        { unit: 'hour', step: 1, format: '%H' },
                    ],
                },
                {
                    name: 'Days',
                    scale_height: 60,
                    min_column_width: 70,
                    scales: [
                        { unit: 'week', step: 1, format: 'Tuần #%W' },
                        { unit: 'day', step: 1, format: '%d %M' },
                    ],
                },
                {
                    name: 'Months',
                    scale_height: 60,
                    min_column_width: 70,
                    scales: [
                        { unit: 'month', step: 1, format: '%F' },
                        { unit: 'week', step: 1, format: 'Tuần %W' },
                    ],
                },
            ],
        });
    }

    render()
    {
        return (
            <div
                ref={(input) =>
                {
                    this.ganttContainer = input;
                }}
                className="wx-material"
                style={{ width: '100%', height: '100%', minHeight: 512 }}
            />
        );
    }
}


export default GanttTemplate;
