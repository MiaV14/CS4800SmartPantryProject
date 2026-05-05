export type ExpiryStatus = 'fresh' | 'expiring' | 'expired';

function parseExpirationDate(dateString: string): Date | null {
  if (!dateString.trim()) {
    return null;
  }

  // Handles Supabase date format: YYYY-MM-DD
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-').map(Number);

    if (!year || !month || !day) {
      return null;
    }

    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // Handles display/manual format: MM/DD/YYYY
  if (dateString.includes('/')) {
    const [month, day, year] = dateString.split('/').map(Number);

    if (!year || !month || !day) {
      return null;
    }

    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  return null;
}

function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getExpiryStatus(expirationDate: string): ExpiryStatus {
  const expiryDate = parseExpirationDate(expirationDate);

  if (!expiryDate) {
    return 'fresh';
  }

  const today = getToday();

  const diffMs = expiryDate.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) {
    return 'expired';
  }

  if (diffDays <= 3) {
    return 'expiring';
  }

  return 'fresh';
}

export function isExpired(expirationDate: string): boolean {
  return getExpiryStatus(expirationDate) === 'expired';
}

export function isExpiringSoon(expirationDate: string): boolean {
  return getExpiryStatus(expirationDate) === 'expiring';
}