const SpinnerRings = () => (
  <>
    <div className="spinner-ring"></div>
    <div className="spinner-ring"></div>
    <div className="spinner-ring"></div>
    <div className="spinner-ring"></div>
  </>
);

export default function LoadingSpinner({ 
  size = "medium", 
  color = "primary", 
  text = "",
  fullScreen = false 
}) {
  const sizeClasses = {
    small: "spinner-sm",
    medium: "spinner-md", 
    large: "spinner-lg"
  };

  const colorClasses = {
    primary: "spinner-primary",
    secondary: "spinner-secondary",
    success: "spinner-success",
    danger: "spinner-danger",
    warning: "spinner-warning",
    info: "spinner-info"
  };

  const spinnerClass = `loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`;

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className={spinnerClass}>
            <SpinnerRings />
          </div>
          {text && <p className="loading-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className={spinnerClass}>
        <SpinnerRings />
      </div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
}