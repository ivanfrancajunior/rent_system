import bcrypt from "bcrypt";

export const generateHashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(8);

  const hashed_password = await bcrypt.hash(password, salt);

  return hashed_password;
};
