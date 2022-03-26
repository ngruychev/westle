function normalize(str) {
  return str.replace(/[^ a-zA-Z_\-0-9]/g, "").trim().toLowerCase();
}

export function fuzzy(a, b) {
  return normalize(a) == normalize(b);
}
