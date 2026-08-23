// Pure form validation for the auth screens. Returns a field -> message map;
// empty object means valid.
export function validateAuth(mode, form) {
  const errors = {}

  if (mode === 'signup' && !form.name?.trim()) errors.name = 'Name is required.'

  if (!form.email?.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email.'

  if (mode !== 'forgot') {
    if (!form.password) errors.password = 'Password is required.'
    else if (mode === 'signup' && form.password.length < 8)
      errors.password = 'Use at least 8 characters.'
  }

  if (mode === 'signup' && form.confirm !== form.password)
    errors.confirm = 'Passwords do not match.'

  return errors
}
