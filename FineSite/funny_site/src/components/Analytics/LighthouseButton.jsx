import React, { useState } from 'react';

export const LighthouseButton = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState(null);

  const runAudit = async () => {
    if (!window.location.href) {
      setError('URL is not available');
      return;
    }

    if (!apiKey) {
      setError('Please enter your Google API key');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      // Формируем URL с правильными параметрами
      const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
      apiUrl.searchParams.append('url', window.location.href);
      apiUrl.searchParams.append('key', apiKey);
      apiUrl.searchParams.append('strategy', 'desktop'); // или 'mobile'
      apiUrl.searchParams.append('category', 'PERFORMANCE');
      apiUrl.searchParams.append('category', 'ACCESSIBILITY');
      apiUrl.searchParams.append('category', 'SEO');

      const response = await fetch(apiUrl.toString());
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.lighthouseResult) {
        throw new Error('Invalid API response structure');
      }

      setReport({
        performance: Math.round((data.lighthouseResult.categories.performance?.score || 0) * 100),
        accessibility: Math.round((data.lighthouseResult.categories.accessibility?.score || 0) * 100),
        seo: Math.round((data.lighthouseResult.categories.seo?.score || 0) * 100),
        fullReport: data
      });
    } catch (error) {
      console.error('Lighthouse audit failed:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 20, 
      right: 20, 
      zIndex: 1000,
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '300px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Lighthouse Audit</h3>
        
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter Google API key"
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
        
        <button 
          onClick={runAudit}
          disabled={loading}
          style={{
            padding: '10px 15px',
            background: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Analyzing...' : 'Run Lighthouse Audit'}
        </button>

        {error && (
          <div style={{ 
            color: 'red',
            padding: '10px',
            backgroundColor: '#ffeeee',
            borderRadius: '4px'
          }}>
            Error: {error}
          </div>
        )}
        
        {report && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '5px'
            }}>
              <span>Performance:</span>
              <span style={{ 
                color: report.performance > 89 ? 'green' : report.performance > 49 ? 'orange' : 'red',
                fontWeight: 'bold'
              }}>
                {report.performance}%
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '5px'
            }}>
              <span>Accessibility:</span>
              <span style={{ 
                color: report.accessibility > 89 ? 'green' : report.accessibility > 49 ? 'orange' : 'red',
                fontWeight: 'bold'
              }}>
                {report.accessibility}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>SEO:</span>
              <span style={{ 
                color: report.seo > 89 ? 'green' : report.seo > 49 ? 'orange' : 'red',
                fontWeight: 'bold'
              }}>
                {report.seo}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};