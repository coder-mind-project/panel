import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@material-ui/core';

import InputFileButton from '@/components/InputFiles.jsx';
import CustomIconButton from '@/components/Buttons/IconButton.jsx';

import { ImageArea, ImageAreaContainer } from './styles';

function ArticleImage(props) {
  const {
    imgSrc,
    imgAlt,
    onChange,
    onRemove,
    showRemoveButton,
    buttonLabel,
    buttonDisabled,
    imageType,
  } = props;

  return (
    <ImageAreaContainer>
      <ImageArea>
        { showRemoveButton && (
          <Box className="remove-img">
            <CustomIconButton icon="delete_forever" tooltip="Remover" size="small" onClick={onRemove} />
          </Box>
        )}
        <img src={imgSrc} alt={imgAlt} className={imageType} />
      </ImageArea>
      <Box display="flex" alignItems="center">
        <InputFileButton onChange={onChange} name="logo" disabled={buttonDisabled}>
          <Button size="small" color="primary" variant="contained">
            {buttonLabel}
          </Button>
        </InputFileButton>
      </Box>
    </ImageAreaContainer>
  );
}

ArticleImage.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  imgAlt: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  showRemoveButton: PropTypes.bool,
  buttonLabel: PropTypes.string.isRequired,
  buttonDisabled: PropTypes.bool,
  imageType: PropTypes.oneOf([
    'article-logo-img',
    'article-secondary-img',
    'article-header-img',
  ]).isRequired,
};

ArticleImage.defaultProps = {
  imgAlt: 'Image',
  onRemove: () => null,
  showRemoveButton: false,
  buttonDisabled: false,

};

export default ArticleImage;
