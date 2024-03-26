import { Box, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
}: InputFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };
  return (
    <FormControl>
      <FormLabel maxWidth='400px'>{label}</FormLabel>
      <Input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxWidth='400px'
      />
    </FormControl>
  );
};

export default InputField;
