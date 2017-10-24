// Some DOM helper
// yarn add smoothscroll-polyfill
require('smoothscroll-polyfill').polyfill();

/**
 * Smooth scroll to a react element
 * @param reactElement
 * @param offset
 */
export function scrollToElement(reactElement, offset) {
  offset = offset || 0;

  if (typeof window !== 'undefined') {
    const containerDomEle = reactElement.container;
    const eleOffset = containerDomEle.getBoundingClientRect();
    const bodyOffset = document.body.getBoundingClientRect();
    
    const newY = (eleOffset.y - bodyOffset.y) - offset;
    
    // Scroll from (0,0) of Oxy coordinate
    window.scroll({top: newY, left: 0, behavior: 'smooth'});
  }
}

export function scrollToPosition(y, x) {
  window.scroll({top: y, left: x, behavior: 'smooth'});
}