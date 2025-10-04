import React, { useEffect, useState } from 'react';

const HealthCheck = () => {
  const [status, setStatus] = useState('Checking...');
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/health`)
      .then((res) => (res.ok ? setStatus('✅ Backend Healthy') : setStatus('❌ Backend Error')))
      .catch(() => setStatus('❌ Backend Unreachable'));
  }, []);
  return (
    <div style={{ margin: '1em 0', padding: '1em', border: '1px solid #ccc' }}>
      <strong>Backend Health:</strong> {status}
    </div>
  );
};
export default HealthCheck;
