export type ExpiryStatus = 'fresh' | 'expiring' | 'expired';

function parseDateString(dateString: string): Date {
  const [month, day, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getExpiryStatus(expirationDate: string): ExpiryStatus {
  if (!expirationDate.trim()) {
    return 'fresh';
  }

  const today = getToday();
  const expiryDate = parseDateString(expirationDate);

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