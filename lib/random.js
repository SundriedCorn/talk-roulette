(() => {
  function draw(items, recent = [], random = Math.random) {
    if (!items.length) return null;
    const seen = new Set(recent);
    let available = items.filter(item => !seen.has(item.id));
    const resetHistory = available.length === 0;
    if (resetHistory) {
      available = items.filter(item => item.id !== recent.at(-1));
      if (!available.length) available = items;
    }
    return { item: available[Math.floor(random() * available.length)], resetHistory };
  }
  window.RandomCycle = { draw };
})();
