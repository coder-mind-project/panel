const size = {
  mobileSmall: '320px',
  mobileMedium: '375px',
  mobileLarge: '475px',
  mobileExtraLarge: '565px',
  tablet: '768px',
  laptop: '1024px',
  laptopLarge: '1440px',
  desktop: '2560px',
};

export const devices = {
  mobileSmall: `@media (max-width: ${size.mobileSmall})`,
  mobileMedium: `@media (max-width: ${size.mobileMedium})`,
  mobileLarge: `@media (max-width: ${size.mobileLarge})`,
  mobileExtraLarge: `@media (max-width: ${size.mobileExtraLarge})`,
  tablet: `@media (max-width: ${size.tablet})`,
  laptop: `@media (max-width: ${size.laptop})`,
  laptopLarge: `@media (max-width: ${size.laptopLarge})`,
  desktop: `@media (max-width: ${size.desktop})`,
  desktopLarge: `@media (max-width: ${size.desktop})`,
};

export default { devices };
