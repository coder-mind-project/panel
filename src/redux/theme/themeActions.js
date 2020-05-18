/**
 * @description "Change app theme in two possible values: 'light' and 'dark'"
 */
export function toogleTheme(theme) {
  return {
    type: 'TOOGLE_THEME',
    theme,
  };
}

export default { toogleTheme };
