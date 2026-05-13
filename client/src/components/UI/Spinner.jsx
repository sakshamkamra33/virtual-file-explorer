// client/src/components/UI/Spinner.jsx

const Spinner = ({ size = 14 }) => {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `2px solid #444`,
        borderTop: `2px solid #61dafb`,
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
      }}
    />
  );
};

export default Spinner;