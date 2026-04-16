import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInputProps } from 'react-native';

import AppInput from '@/components/ui/AppInput';
import { COLORS } from '@/constants/colors';

type PasswordInputProps = TextInputProps & {
  label?: string;
  required?: boolean;
};

export default function PasswordInput({
  label,
  required = false,
  ...textInputProps
}: PasswordInputProps) {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <AppInput
      {...textInputProps}
      label={label}
      required={required}
      secureTextEntry={isHidden}
      rightAccessory={
        <Pressable onPress={() => setIsHidden((prev) => !prev)} hitSlop={10}>
          <Ionicons
            name={isHidden ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={COLORS.blue_spruce_shadow}
          />
        </Pressable>
      }
    />
  );
}