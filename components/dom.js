(() => {
  const $ = id => document.getElementById(id);
  function el(tag, text = '', className = '') {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  window.UI = { $, el };
})();
