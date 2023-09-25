import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import papaparse from 'papaparse';

import Drawer from './components/Drawer';
import Header from './components/Header';

function App() {
  const [isSettingVisible, setSettingVisible] = useState(false);
  const [setting, setSetting] = useState({ email: '', teams: [], task_regex: '' });
  const [json, setJson] = useState({});
  const [csv, setCsv] = useState('');

  const file = papaparse.parse(csv, { header: true, skipEmptyLines: true });

  const makeColumns = (rawColumns) => rawColumns.map((column) => ({
    name: column,
    selector: (row) => row[column],
    wrap: true,
    width: '180px',
    ...((column === 'Today' || column === 'Yesterday' || column === 'Description') && { width: 'unset' }),
  }));

  useEffect(() => {
    let data = localStorage.getItem('wsn') || '{}';
    data = JSON.parse(data);
    setSetting(data);
  }, []);

  return (
    <>
      <Header
        csvData={[csv, setCsv]}
        data={setting}
        jsonData={[json, setJson]}
        onDrawerOpen={() => setSettingVisible(true)}
      />
      <Drawer
        data={setting}
        isVisible={isSettingVisible}
        onClose={() => setSettingVisible(false)}
        setData={setSetting}
      />
      <div className="p-4">
        {file.data.length > 0 && (
        <DataTable
          data={file.data}
          columns={makeColumns(file.meta.fields)}
          dense
        />
        )}
      </div>
    </>
  );
}

export default App;
