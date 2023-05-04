function CheckOverflow(el?: HTMLElement | null) {
  if (el) {
    const documentWidth = document.documentElement.clientWidth;
    const documentHeight = document.documentElement.clientHeight;
    const bottom = el.getBoundingClientRect().bottom;
    const right = el.getBoundingClientRect().right;
    return {
      bottom: bottom >= documentHeight,
      right: right >= documentWidth,
    };
  }
  return {
    bottom: false,
    right: false,
  };
}

export default CheckOverflow;
