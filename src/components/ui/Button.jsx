const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    type = 'button',
    fullWidth = false,
    onClick,
    disabled = false
  }) => {
    const baseClasses = 'btn inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-5 py-2.5 text-lg',
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : '';
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          ${baseClasses} 
          ${variantClasses[variant]} 
          ${sizeClasses[size]} 
          ${widthClass}
          ${disabledClass}
        `}
      >
        {children}
      </button>
    );
  };
  
  export default Button;