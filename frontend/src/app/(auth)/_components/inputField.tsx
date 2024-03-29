import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormControl>
      <FormLabel maxWidth='400px'>{label}</FormLabel>
      <InputGroup maxWidth='400px'>
        <Input
          type={showPassword ? 'text' : type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
        {type === 'password' && (
          <InputRightElement>
            <Button onClick={togglePasswordVisibility} h='1.75rem' size='sm'>
              {showPassword ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};
