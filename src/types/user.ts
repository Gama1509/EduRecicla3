interface User {
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export default User;