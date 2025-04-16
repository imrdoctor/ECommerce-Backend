export function sanitizeSort(sort: string, allowed: string[]): string {
    return sort
      .split(',')
      .map(f => f.trim())
      .filter(field => {
        const clean = field.startsWith('-') ? field.slice(1) : field;
        return allowed.includes(clean);
      })
      .join(' ');
  }
  