import { Layout } from 'antd';
import './index.less';

const Footer = (): JSX.Element =>
{
    const year = new Date().getFullYear();
    return (
        <Layout.Footer
            className="footer"
            style={{ marginTop: 0, marginBottom: 0, paddingTop: 5, paddingBottom: 3, textAlign: 'center' }}
        >
      HardWorking - © {year}
        </Layout.Footer>
    );
};
export default Footer;
