function intersection(setA: Set<string>, setB: Set<string>) {
    const _intersection = new Set();
    for (const elem of setB) {
      if (setA.has(elem)) {
        _intersection.add(elem);
      }
    }
    return _intersection;
}

function difference(setA: Set<string>, setB: Set<string>) {
  const _difference = new Set(setA);
  for (const elem of Array.from(setB)) {
    if (setA.has(elem)) {
      _difference.delete(elem);
    }
    
  }
  return _difference;
}

export { intersection , difference };