import React, { useState } from 'react';

export const LighthouseButton = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(''); // Храните ключ в состоянии или .env

  const runAudit = async () => {
    if (!window.location.href) {
      console.error('URL is not available');
      return;
    }

    setLoading(true);
    setReport(null); // Сбрасываем предыдущий отчет
    
    try {
      // Добавляем параметр strategy=mobile или strategy=desktop
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${
        encodeURIComponent(window.location.href)
      }&category=PERFORMANCE&category=ACCESSIBILITY&category=SEO&strategy=desktop${
        apiKey ? `&key=${apiKey}` : ''
      }`;

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.lighthouseResult) {
        throw new Error('Invalid API response');
      }

      setReport({
        performance: Math.round((data.lighthouseResult.categories.performance?.score || 0) * 100),
        accessibility: Math.round((data.lighthouseResult.categories.accessibility?.score || 0) * 100),
        seo: Math.round((data.lighthouseResult.categories.seo?.score || 0) * 100),
        fullReport: data // Сохраняем полный отчет для деталей
      });
    } catch (error) {
      console.error('Lighthouse audit failed:', error);
      setReport({
        error: error.message || 'Failed to run Lighthouse audit'
      });
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
        gap: '10px'
      }}>
        {/* Поле для API ключа (можно убрать в продакшене) */}
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Введите Google API ключ"
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
          {loading ? 'Анализ...' : 'Запустить Lighthouse'}
        </button>
      </div>
      
      {report && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '300px'
        }}>
          {report.error ? (
            <div style={{ color: 'red' }}>
              Ошибка: {report.error}
            </div>
          ) : (
            <>
              <h3 style={{ marginTop: 0 }}>Результаты аудита</h3>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>Производительность:</strong> 
                <span style={{ 
                  color: report.performance > 89 ? 'green' : report.performance > 49 ? 'orange' : 'red',
                  marginLeft: '5px'
                }}>
                  {report.performance}%
                </span>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>Доступность:</strong> 
                <span style={{ 
                  color: report.accessibility > 89 ? 'green' : report.accessibility > 49 ? 'orange' : 'red',
                  marginLeft: '5px'
                }}>
                  {report.accessibility}%
                </span>
              </div>
              
              <div>
                <strong>SEO:</strong> 
                <span style={{ 
                  color: report.seo > 89 ? 'green' : report.seo > 49 ? 'orange' : 'red',
                  marginLeft: '5px'
                }}>
                  {report.seo}%
                </span>
              </div>
              
              {report.fullReport && (
                <details style={{ marginTop: '10px' }}>
                  <summary>Подробности</summary>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap',
                    fontSize: '12px',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(report.fullReport, null, 2)}
                  </pre>
                </details>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LighthouseButton;