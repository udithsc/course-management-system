import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import Link from '@mui/material/Link';
import * as Muicon from '@mui/icons-material';
import configData from '../../data.json';

export default function Breadcrumbs() {
  const location = useLocation();
  const routes = [];

  routes.push(configData.ROUTES[0]);

  const GenerateIcon = (variation, props = {}) => {
    const IconName = Muicon[variation];
    const icon = <IconName {...props} sx={{ mr: 0.5 }} fontSize="inherit" />;
    return icon;
  };

  const currentRoute = configData.ROUTES.find((e) => e.breadcrumbs.includes(location.pathname));
  if (currentRoute) routes.push(currentRoute);

  if (currentRoute.subMenu.length > 0) {
    const subRoute = currentRoute.subMenu.find((e) => e.path === location.pathname);
    if (subRoute) routes.push(subRoute);
  }

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {routes.map((route) => (
        <Link
          key={route.path}
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          href={route.path}
        >
          {GenerateIcon(route.icon)}
          {route.title}
        </Link>
      ))}
    </MuiBreadcrumbs>
  );
}
