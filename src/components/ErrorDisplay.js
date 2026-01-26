import React from 'react';
import './ErrorDisplay.css';

function ErrorDisplay({ message, onRetry }) {
  return (
    <div className="error-display">
      <h3>Произошла ошибка</h3>
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Попробовать снова
        </button>
      )}
      <a href="/" className="home-link">
        На главную
      </a>
    </div>
  );
}

export default ErrorDisplay;
