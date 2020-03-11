import React from 'react';
import { Redirect } from 'react-router-dom';

function RouteNotFound() {
  return <Redirect to="/" />;
}

export default RouteNotFound;
