import type { ChangeEvent } from 'react';

const Input: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    centered?: boolean;
    required?: boolean;
}> = ({ label, name, value, onChange, centered, required }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={` p-3 w-full ${centered ? 'text-center text-2xl tracking-widest font-mono' : 'pr-4'
                    } py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
        </div>
    </div>
);

export default Input;