'use strict';

const DomRenderer = {
  render(arg1, arg2) {
    if (arg2) {
      const $dom = DomRenderer.createDom(arg2);
      arg1.parentNode.replaceChild($dom, arg1);
      return $dom;
    }

    return DomRenderer.createDom(arg1);
  },
  createDom(domData) {
    if (typeof domData === 'string') {
      return document.createTextNode(domData);
    }

    if (domData.length) {
      const $fragment = document.createDocumentFragment();
      domData.forEach(child => {
        $fragment.appendChild(DomRenderer.render(child));
      });
      return $fragment;
    }

    const $dom = (!domData.tag || domData.tag === 'dummy') ? document.createDocumentFragment() : document.createElement(domData.tag);
    domData.attrs && Object.keys(domData.attrs).forEach(attrName => {
      if (attrName === 'className') {
        $dom.className = domData.attrs.className;
        return;
      }

      if (attrName === 'style') {
        const value = domData.attrs.style;
        if (typeof value === 'object') {
          Object.keys(value).forEach(property => {
            $dom.style[property] = value[property];
          });
          return;
        }

        $dom.style.cssText = value;
        return;
      }

      if (attrName === 'callback') {
        domData.attrs.callback($dom);
        return;
      }

      $dom.setAttribute(attrName, domData.attrs[attrName]);
    });

    domData.children && domData.children.forEach(child => {
      $dom.appendChild(DomRenderer.createDom(child));
    });

    return $dom;
  }

};

module.exports = DomRenderer;
