export function sanitizeFields(select: string, allowed: string[]): string {
    return select
      .split(',')
      .map(f => f.trim())
      .filter(f => allowed.includes(f))
      .join(' ');
  }
  