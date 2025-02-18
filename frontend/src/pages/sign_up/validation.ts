// These functions are used to validate username and password input on the
// sign-up form.
// If the input is invalid, then an error string is returned otherwise an
// empty string is returned

export const validateUsername = (username: string): string => {
  if (username.length > 16) return "Username must be 16 characters or less.";

  if (!/^[a-zA-Z0-9]*$/.test(username))
    return "Username must consist of only letters and numbers.";

  return "";
};

export const validatePassword = (password: string): string => {
  // if (password.length === 0) return "";

  // if (password.length < 12) return "Password must be 12 characters or longer.";

  // if (password.length > 256) return "Password must be 256 characters or less.";

  // if (!/[a-z]/.test(password))
  //   return "Password must include at least one lowercase letter.";

  // if (!/[A-Z]/.test(password))
  //   return "Password must include at least one uppercase letter.";

  // if (!/[0-9]/.test(password))
  //   return "Password must include at least one digit.";

  // if (!/[@#$%^&*(),.?":{}|<>]/.test(password))
  //   return "Password must include at least one special character.";

  return "";
};
