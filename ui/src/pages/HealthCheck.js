import React, { useState, useEffect } from 'react';

export default () => {
  const [data, setData] = useState({ status: 504 });

  const fetchHealthCheck = async () => {
    const result = await fetch(`${window.config.radishApiUrl}/healthcheck`);
    setData(result);
  };

  useEffect(() => {
    fetchHealthCheck();
  }, []);

  return <div>{data.status === 200 ? 'OK' : 'NOT OK'}</div>;
};
