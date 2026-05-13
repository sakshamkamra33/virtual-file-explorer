// client/src/components/UI/Breadcrumb.jsx

const Breadcrumb = ({ path }) => {
  if (!path) return null;

  const parts = path.split('/').filter(Boolean);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '4px',
      fontSize: '12px',
      color: '#888',
      padding: '6px 12px',
      borderBottom: '1px solid #2a2a2a',
      background: '#1a1a1a',
    }}>
      <span style={{ color: '#61dafb', cursor: 'pointer' }}>📱 Internal Storage</span>
      {parts.map((part, index) => (
        <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#444' }}>›</span>
          <span style={{
            color: index === parts.length - 1 ? '#fff' : '#888',
            fontWeight: index === parts.length - 1 ? 600 : 400,
          }}>
            {part}
          </span>
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;