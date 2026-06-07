export function getCookie(name) {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find((cookieEntry) =>
      cookieEntry.startsWith(`${encodeURIComponent(name)}=`),
    );

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split('=')[1] || '');
}

export function setCookie(name, value, options = {}) {
  if (typeof document === 'undefined') return;

  const opts = {
    path: '/',
    sameSite: 'lax',
    secure: window.location.protocol === 'https:',
    ...options,
  };

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (opts.maxAge !== undefined) {
    cookieString += `; max-age=${opts.maxAge}`;
  }

  if (opts.path) {
    cookieString += `; path=${opts.path}`;
  }

  if (opts.sameSite) {
    cookieString += `; samesite=${opts.sameSite}`;
  }

  if (opts.secure) {
    cookieString += '; secure';
  }

  if (opts.domain) {
    cookieString += `; domain=${opts.domain}`;
  }

  document.cookie = cookieString;
}

export function deleteCookie(name) {
  setCookie(name, '', { maxAge: -1 });
}
