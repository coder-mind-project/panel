import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { appTheme, asyncSelectValueType } from '@/types';

import { Typography } from '@material-ui/core';

import AsyncSelect from 'react-select/async';
import { connect } from 'react-redux';

import { CustomInputLabel, CustomFormGroup, searchThemeStyle } from './styles';

function CustomAsyncSelect(props) {
  const {
    label,
    value,
    placeholder,
    helperText,
    loadingMessage,
    onChange,
    loadOptions,
    theme,
  } = props;

  const [mounted, setMounted] = useState(false);
  const [currentValue, setCurrentValue] = useState({});

  function changeValue(valueChanged) {
    setCurrentValue(valueChanged);
    onChange(valueChanged);
  }

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      setCurrentValue(value);
    }
  }, [currentValue, value, mounted]);

  return (
    <CustomFormGroup>
      {label && (
        <CustomInputLabel theme={theme}>
          {label}
        </CustomInputLabel>
      )}
      <AsyncSelect
        styles={searchThemeStyle({ theme })}
        cacheOptions
        value={currentValue}
        isClearable
        loadOptions={loadOptions}
        onChange={changeValue}
        noOptionsMessage={(event) => (event.inputValue.length >= 3
          ? 'Nenhum resultado encontrado'
          : 'Faça uma busca com pelo menos 3 caracteres')}
        loadingMessage={() => loadingMessage}
        placeholder={placeholder}
      />
      { helperText && (
        <Typography variant="caption" component="span">
          {helperText}
        </Typography>
      )}
    </CustomFormGroup>
  );
}

CustomAsyncSelect.propTypes = {
  theme: appTheme.isRequired,
  value: asyncSelectValueType,
  loadingMessage: PropTypes.string,
  placeholder: PropTypes.string,
  loadOptions: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.node,
};

CustomAsyncSelect.defaultProps = {
  value: null,
  loadingMessage: 'Carregando...',
  placeholder: '',
  label: null,
  helperText: null,
};

const mapStateToProps = (state) => ({ theme: state.theme });

export default connect(mapStateToProps)(CustomAsyncSelect);
