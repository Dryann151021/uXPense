export function decodeJwtPayload(token) {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    const decoded = decodeURIComponent(
      payload
        .split('')
        .map((char) => `%${('00' + char.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(''),
    );
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}
