import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import ReactExport from 'react-export-excel';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const Download: React.FunctionComponent<any> = ({ columns, data, fileName }) =>
{
    return (
        <ExcelFile
            element={<Button type="primary"><DownloadOutlined /> Export Excel</Button>}
            filename="Chấm công"
        >
            <ExcelSheet
                data={data}
                name={fileName}
            >
                {columns && columns.map(col => (
                    <ExcelColumn
                        key={col.label}
                        label={col.label}
                        value={col.value}
                    />
                ))}
    
            </ExcelSheet>
        </ExcelFile>
    );
};


export default Download;
