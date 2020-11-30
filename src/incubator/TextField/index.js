import _pt from "prop-types";

/**
 * Known issues with React Native TextInput component
 * 1. iOS - input inner padding is off in multiline mode
 * 2. Android - input has minHeight that can't be overridden with zero padding (unlike iOS)
 * 3. Passing typography preset that includes lineHeight usually cause alignment issues with
 * other elements (leading/trailing accessories). It usually best to set lineHeight with undefined
 */
import React, { useMemo } from 'react';
import { omit } from 'lodash';
import { asBaseComponent, forwardRef } from '../../commons/new';
import View from '../../components/view';
import { ValidationMessagePosition } from './types';
import Input from './Input';
import ValidationMessage from './ValidationMessage';
import Label from './Label';
import FieldContext from './FieldContext';
import useFieldState
/* , FieldStateProps */
from './useFieldState';
import FloatingPlaceholder from './FloatingPlaceholder';
import CharCounter from './CharCounter';

/**
 * @description: A controlled, customizable TextField with validation support
 * @extends: TextInput
 * @extendslink: https://reactnative.dev/docs/textinput
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/IncubatorTextFieldScreen.tsx
 */
const TextField = ({
  modifiers,
  // General
  fieldStyle,
  containerStyle,
  floatingPlaceholder,
  floatingPlaceholderColor,
  floatingPlaceholderStyle,
  hint,
  // Label
  label,
  labelColor,
  labelStyle,
  labelProps,
  // Accessory Buttons
  leadingAccessory,
  trailingAccessory,
  // Validation
  enableErrors,
  // TODO: rename to enableValidation
  validationMessage,
  validationMessageStyle,
  validationMessagePosition = ValidationMessagePosition.BOTTOM,
  // Char Counter
  showCharCounter,
  charCounterStyle,
  // Input
  placeholder,
  ...props
}) => {
  const {
    onFocus,
    onBlur,
    onChangeText,
    fieldState
  } = useFieldState(props);
  const context = useMemo(() => {
    return { ...fieldState,
      disabled: props.editable === false
    };
  }, [fieldState, props.editable]);
  const {
    margins,
    paddings,
    typography,
    color
  } = modifiers;
  const typographyStyle = useMemo(() => omit(typography, 'lineHeight'), [typography]);
  const colorStyle = useMemo(() => color && {
    color
  }, [color]);
  return <FieldContext.Provider value={context}>
      <View style={[margins, containerStyle]}>
        <Label label={label} labelColor={labelColor} labelStyle={labelStyle} labelProps={labelProps} floatingPlaceholder={floatingPlaceholder} validationMessagePosition={validationMessagePosition} />
        {validationMessagePosition === ValidationMessagePosition.TOP && <ValidationMessage enableErrors={enableErrors} validationMessage={validationMessage} validationMessageStyle={validationMessageStyle} />}
        <View style={[paddings, fieldStyle]}>
          <View row centerV>
            {leadingAccessory}
            <View flex>
              {floatingPlaceholder && <FloatingPlaceholder placeholder={placeholder} floatingPlaceholderStyle={[typographyStyle, floatingPlaceholderStyle]} floatingPlaceholderColor={floatingPlaceholderColor} />}
              <Input {...props} style={[typographyStyle, colorStyle, props.style]} onFocus={onFocus} onBlur={onBlur} onChangeText={onChangeText} placeholder={floatingPlaceholder ? undefined : placeholder} hint={hint} />
            </View>
            {trailingAccessory}
          </View>
        </View>
        <View row spread>
          {validationMessagePosition === ValidationMessagePosition.BOTTOM && <ValidationMessage enableErrors={enableErrors} validationMessage={validationMessage} validationMessageStyle={validationMessageStyle} retainSpace />}
          {showCharCounter && <CharCounter maxLength={props.maxLength} charCounterStyle={charCounterStyle} />}
        </View>
      </View>
    </FieldContext.Provider>;
};

TextField.propTypes = {
  /**
       * Pass to render a leading element
       */
  leadingAccessory: _pt.element,

  /**
       * Pass to render a trailing element
       */
  trailingAccessory: _pt.element,

  /**
       * Pass to add floating placeholder support
       */
  floatingPlaceholder: _pt.bool,

  /**
       * Should validate when the TextField mounts
       */
  validateOnStart: _pt.bool,

  /**
       * Should validate when the TextField value changes
       */
  validateOnChange: _pt.bool,

  /**
       * Should validate when losing focus of TextField
       */
  validateOnBlur: _pt.bool
};
TextField.displayName = 'Incubator.TextField';
TextField.validationMessagePositions = ValidationMessagePosition;
export default asBaseComponent(forwardRef(TextField));