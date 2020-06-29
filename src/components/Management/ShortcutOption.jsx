import React from 'react';
import { Icon, Typography } from '@material-ui/core';

import { CustomShortcutOption, CustomLink } from './styles';

const ShortcutOption = (props) => {
  const {
    icon,
    title,
    idRef,
    colorLeft,
    colorRight,
  } = { ...props };

  function anchorTo(id) {
    const element = document.getElementById(id);
    const top = element ? element.offsetTop : 0;
    window.scrollTo(0, top);
  }

  return (
    <CustomLink
      to={`#${idRef}`}
      colorleft={colorLeft}
      colorright={colorRight}
      onClick={() => anchorTo(idRef)}
    >
      <CustomShortcutOption item xs={12}>
        <Icon fontSize="large">
          {icon}
        </Icon>
        <Typography variant="body1" component="p">{title}</Typography>
      </CustomShortcutOption>
    </CustomLink>
  );
};

export default ShortcutOption;
