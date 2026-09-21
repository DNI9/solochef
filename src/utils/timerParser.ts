export function extractDurationSeconds(text: string): number | null {
  const match = text.match(/(\d{1,5})\s*(hour|hr|minute|min|second|sec)s?/i);
  if (!match) return null;
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  
  if (unit.startsWith('hour') || unit.startsWith('hr')) {
    return value * 3600;
  }
  if (unit.startsWith('minute') || unit.startsWith('min')) {
    return value * 60;
  }
  if (unit.startsWith('second') || unit.startsWith('sec')) {
    return value;
  }
  return null;
}
