
const Button: React.FC<{
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }> = ({ onClick, loading, disabled, children }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold 
                  ${loading || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'}`}
    >
      {loading ? 'Loading ... ' : children}
    </button>
  );
  
  
  export default Button;