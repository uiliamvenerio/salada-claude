const Card = ({ children, title, footer, className = '' }) => {
    return (
      <div className={`card ${className}`}>
        {title && (
          <div className="mb-4 pb-2 border-b border-gray-200">
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
        )}
        <div>
          {children}
        </div>
        {footer && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    );
  };
  
  export default Card;