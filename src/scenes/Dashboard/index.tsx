
import { CheckOutlined, MessageOutlined, QuestionOutlined, UserAddOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import React from 'react';
import './index.less';


export class Dashboard extends React.Component<any>
{
    async componentDidMount(): Promise<void>
    {
        setTimeout(() => this.setState({ cardLoading: false }), 1000);
    }

  state = {
      cardLoading: true,
      lineChartLoading: true,
      barChartLoading: true,
      pieChartLoading: true,
  };

  render(): JSX.Element
  {
      const { cardLoading } = this.state;

      //   const visitorStatisticList = [
      //       { title: 'TODAY', body: '1.200 user' },
      //       { title: 'YESTERDAY', body: '3.872 user' },
      //       { title: 'LAST WEEK', body: '26.582 user' },
      //   ];

      return (
          <div>
              <Row gutter={16}>
                  <Col
                      className="dashboardCard"
                      xs={{ offset: 1, span: 22 }}
                      sm={{ offset: 1, span: 22 }}
                      md={{ offset: 1, span: 11 }}
                      lg={{ offset: 1, span: 11 }}
                      xl={{ offset: 0, span: 6 }}
                      xxl={{ offset: 0, span: 6 }}
                  >
                      <Card
                          className="dasboardCard-task"
                          bodyStyle={{ padding: 10 }}
                          loading={cardLoading}
                          bordered={false}
                      >
                          <Col span={8}>
                              <CheckOutlined className="dashboardCardIcon" />
                          </Col>
                          <Col span={16}>
                              <p className="dashboardCardName">New Task</p>
                              <label className="dashboardCardCounter">125</label>
                          </Col>
                      </Card>
                  </Col>
                  <Col
                      className="dashboardCard"
                      xs={{ offset: 1, span: 22 }}
                      sm={{ offset: 1, span: 22 }}
                      md={{ offset: 1, span: 11 }}
                      lg={{ offset: 1, span: 11 }}
                      xl={{ offset: 0, span: 6 }}
                      xxl={{ offset: 0, span: 6 }}
                  >
                      <Card
                          className="dasboardCard-ticket"
                          bodyStyle={{ padding: 10 }}
                          loading={cardLoading}
                          bordered={false}
                      >
                          <Col span={8}>
                              <QuestionOutlined className="dashboardCardIcon" />
                          </Col>
                          <Col span={16}>
                              <p className="dashboardCardName">New Ticket</p>
                              <label className="dashboardCardCounter">257</label>
                          </Col>
                      </Card>
                  </Col>
                  <Col
                      className="dashboardCard"
                      xs={{ offset: 1, span: 22 }}
                      sm={{ offset: 1, span: 22 }}
                      md={{ offset: 1, span: 11 }}
                      lg={{ offset: 1, span: 11 }}
                      xl={{ offset: 0, span: 6 }}
                      xxl={{ offset: 0, span: 6 }}
                  >
                      <Card
                          className="dasboardCard-comment"
                          bodyStyle={{ padding: 10 }}
                          loading={cardLoading}
                          bordered={false}
                      >
                          <Col span={8}>
                              <MessageOutlined className="dashboardCardIcon" />
                          </Col>
                          <Col span={16}>
                              <p className="dashboardCardName">New Comments</p>
                              <label className="dashboardCardCounter">243</label>
                          </Col>
                      </Card>
                  </Col>
                  <Col
                      className="dashboardCard"
                      xs={{ offset: 1, span: 22 }}
                      sm={{ offset: 1, span: 22 }}
                      md={{ offset: 1, span: 11 }}
                      lg={{ offset: 1, span: 11 }}
                      xl={{ offset: 0, span: 6 }}
                      xxl={{ offset: 0, span: 6 }}
                  >
                      <Card
                          className="dasboardCard-visitor"
                          bodyStyle={{ padding: 10 }}
                          loading={cardLoading}
                          bordered={false}
                      >
                          <Col span={8}>
                              <UserAddOutlined className="dashboardCardIcon" />
                          </Col>
                          <Col span={16}>
                              <p className="dashboardCardName">New Visitors</p>
                              <label className="dashboardCardCounter">1225</label>
                          </Col>
                      </Card>
                  </Col>
              </Row>

              {/* <Row>
                  <Col span={24}>
                      <Card
                          className="dashboardBox"
                          title="Visit Statistics"
                          loading={lineChartLoading}
                          bordered={false}
                      >
                          <LineChartExample />
                      </Card>
                  </Col>
              </Row>

              <Row gutter={16}>
                  <Col
                      xs={{ offset: 1, span: 22 }}
                      sm={{ offset: 1, span: 22 }}
                      md={{ offset: 1, span: 22 }}
                      lg={{ offset: 0, span: 8 }}
                      xl={{ offset: 0, span: 8 }}
                      xxl={{ offset: 0, span: 8 }}
                  >
                      <Card
                          className="dashboardCardTinyLine"
                          loading={barChartLoading}
                          bordered={false}
                      >
                          <TinyLineChartExample />
                          <ListExample value={visitorStatisticList} />
                      </Card>
                  </Col>
                  <Col
                      xs={{ offset: 1, span: 22 }}
                      sm={{ offset: 1, span: 22 }}
                      md={{ offset: 1, span: 22 }}
                      lg={{ offset: 0, span: 8 }}
                      xl={{ offset: 0, span: 8 }}
                      xxl={{ offset: 0, span: 8 }}
                  >
                      <Card
                          className="latestSocialTrendsList"
                          loading={barChartLoading}
                          bordered={false}
                      >
                          <TinyLineChartExample />
                          <ListExample value={visitorStatisticList} />
                      </Card>
                  </Col>
                  <Col
                      xs={{ offset: 1, span: 22 }}
                      sm={{ offset: 1, span: 22 }}
                      md={{ offset: 1, span: 22 }}
                      lg={{ offset: 0, span: 8 }}
                      xl={{ offset: 0, span: 8 }}
                      xxl={{ offset: 0, span: 8 }}
                  >
                      <Card
                          className="answeredTickeds"
                          loading={barChartLoading}
                          bordered={false}
                      >
                          <TinyLineChartExample />
                          <ListExample value={visitorStatisticList} />
                      </Card>
                  </Col>
              </Row>

              <Row gutter={16}>
                  <Col span={16}>
                      <Card
                          title="Payment Statistics"
                          className="dashboardBox"
                          loading={barChartLoading}
                          bordered={false}
                      >
                          <BarChartExample />
                      </Card>
                  </Col>
                  <Col span={8}>
                      <Card
                          title="Browser Usage"
                          className="dashboardBox"
                          loading={pieChartLoading}
                          bordered={false}
                      >
                          <PieChartExample />
                      </Card>
                  </Col>
              </Row> */}
          </div>
      );
  }
}

export default Dashboard;
