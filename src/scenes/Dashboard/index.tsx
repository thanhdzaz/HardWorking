
import { Card, Col, Row, Select } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { useRecoilState } from 'recoil';
import { useStore } from 'stores';
import { ProjectAtom } from 'stores/atom/project';
import { useGetTasks } from 'utils';
import './index.less';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { STATUS_LIST } from 'constant';


ChartJS.register(ArcElement, Tooltip, Legend);


const Dashboard: React.FunctionComponent = observer(() =>
{

    const {
        sessionStore, projectStore,
    } = useStore();

    const {
        task,
    } = useGetTasks();

    const [project,setProject] = useRecoilState(ProjectAtom);

    const changeProject = (id:string):void =>
    {
        sessionStore?.setProject(id);
        localStorage.setItem('project',id);
        setProject(id);
    };

    const data = {
        labels: [...STATUS_LIST.map(status => status.title)],
        datasets: [
            {
                label: '# công việc',
                data: [...STATUS_LIST.map(status =>task.filter(t=>t.status === status.id).length ?? 0)],
                backgroundColor: [
                    ...STATUS_LIST.map(status =>status.color),
                ],
                borderColor: [
                    ...STATUS_LIST.map(status =>status.color),

                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <Card>
            <Row
                style={{
                    marginBottom: 15,
                }}
            >
                Dự án:
                <Select
                    style={{ width: '100%' }}
                    defaultValue={project}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input:any, option:any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    showSearch
                    onChange={(val)=>changeProject(val)}
                >
                    {projectStore?.listProject !== null && (projectStore?.listProject?.length ?? 0) > 0 && projectStore?.listProject?.map((p:any) =>(
                        <Select.Option
                            key={p.id}
                            value={p.id}
                        >
                            {p.title}
                        </Select.Option>
                    ))}
                </Select>
            </Row>
            <Row
                gutter={[16,16]}
                style={{
                    overflow: 'hidden',
                }}
            >
                <Col span={12}>
                    <Card
                        className="card-dashboard-chart"
                        style={{
                            padding: '20%',
                            height: '70vh',
                        }}
                    >
                        <p
                            className="dashboardCardName"
                            style={{
                                position: 'absolute',
                                top: 10, left: 10,
                            }}
                        >Biểu đồ công việc
                        </p>
                        <Doughnut
                            data={data}
                            width="90%"
                        />

                    </Card>
                </Col>
                <Col span={12}>
                    <Row gutter={[16,16]}>
                        <Col span={12}>
                            <Card
                                className="card-dashboard"
                                style={{
                                    backgroundColor: STATUS_LIST[0].color,
                                }}
                            >
                                <p className="dashboardCardName">Công việc mới</p>
                                <label className="dashboardCardCounter">
                                    {
                                        task.filter(t=>t.status === 0).length ?? 0
                                    }
                                </label>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                className="card-dashboard"
                                style={{
                                    backgroundColor: STATUS_LIST[1].color,
                                }}
                            >
                                <p className="dashboardCardName">Công việc đang làm</p>
                                <label className="dashboardCardCounter">
                                    {
                                        task.filter(t=>t.status === 1).length ?? 0
                                    }
                                </label>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                className="card-dashboard"
                                style={{
                                    backgroundColor: STATUS_LIST[2].color,
                                }}
                            >
                                <p className="dashboardCardName">Công việc đã hoàn thành</p>
                                <label className="dashboardCardCounter">
                                    {
                                        task.filter(t=>t.status === 2).length ?? 0
                                    }
                                </label>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card
                                className="card-dashboard"
                                style={{
                                    backgroundColor: STATUS_LIST[3].color,
                                }}
                            >
                                <p className="dashboardCardName">Công việc đã xác nhận</p>
                                <label className="dashboardCardCounter">
                                    {
                                        task.filter(t=>t.status === 3).length ?? 0
                                    }
                                </label>
                            </Card>
                        </Col>
                
                    </Row>
                </Col>
            </Row>

        </Card>
    );
});


export default Dashboard;
