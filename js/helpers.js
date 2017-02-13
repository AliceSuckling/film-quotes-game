
export const combo = combo => { 
  let words = combo.split(" "); 
  words = words.map(word => word.split("").join(" ")); 
  return words.join(" space "); 
}; 
