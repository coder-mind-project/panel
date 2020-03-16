export function scrollToTop(element) {
  const ref = element || document.documentElement;
  ref.scrollTop = 0;
}

export default { scrollToTop };
