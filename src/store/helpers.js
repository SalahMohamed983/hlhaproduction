export function asList(data) {
  if (Array.isArray(data)) return data;
  if (data?.items) return data.items;
  return [];
}
