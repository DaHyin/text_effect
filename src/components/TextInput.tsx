import './TextInput.css';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div className="text-input-wrapper">
      <label className="text-input-label">텍스트 입력</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="텍스트를 입력하세요"
        className="text-input-field"
      />
    </div>
  );
}


