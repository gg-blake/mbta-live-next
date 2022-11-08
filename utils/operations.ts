function intersection(setA: Set<string>, setB: Set<string>) {
    const _intersection = new Set();
    for (const elem of Array.from(setB)) {
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

function sliceAtFirstMutual(a: string[], b: string[]) {
  // Accepts two arrays of strings as inputs
  // Returns spliced segment of Array B starting from first shared value with Array A
  var index: number = 0;

  // Make a list of all of all the values in Bs' positions within A
  // If a value within B isn't present in A at all, lastIndexOf returns -1 
  let indices = b.map(i => {
      return a.lastIndexOf(i)
  })

  // Assigns the matched value in b that is indexed the farthest along a
  index = b.indexOf(a[Math.max(...indices)]);

  // Remove values of array B before the last shared value between A and B
  return b.slice(index)
  
  
}

// Returns list of length n of 0 to n-1
function range(n: number) {
  // @ts-ignore
  return [...Array(n).keys()]
}

export { intersection , difference , sliceAtFirstMutual , range };