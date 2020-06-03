// eslint-disable-next-line import/prefer-default-export
export function scrollToTop(element) {
  const ref = element || document.documentElement;
  ref.scrollTop = 0;
}
