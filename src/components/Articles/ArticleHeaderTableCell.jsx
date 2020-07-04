import React from 'react';
import PropTypes from 'prop-types';
import { appTheme } from '@/types';

import { connect } from 'react-redux';

import { CustomIcon, FakeHeaderCell } from './styles';

function ArticleHeaderTableCell(props) {
  const { icon, label, theme } = props;

  return (
    <FakeHeaderCell theme={theme}>
      <CustomIcon>{icon}</CustomIcon>
      {label}
    </FakeHeaderCell>
  );
}

ArticleHeaderTableCell.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  theme: appTheme.isRequired,
};

const mapStateToProps = (state) => ({ theme: state.theme });

export default connect(mapStateToProps)(ArticleHeaderTableCell);
