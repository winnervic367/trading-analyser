
// Simple auth service with localStorage for persistence
// In a real app, you would use a proper authentication system (Supabase, Auth0, etc.)

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface StoredUser extends User {
  password: string;
}

// Function to register a new user
export const registerUser = (email: string, password: string, name: string): User => {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw new Error("User with this email already exists");
  }
  
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    email,
    password, // In a real app, this would be hashed
    name,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Function to login a user
export const loginUser = (email: string, password: string): User => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error("Invalid email or password");
  }
  
  // Set the current user in localStorage
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Function to logout the current user
export const logoutUser = (): void => {
  localStorage.removeItem('currentUser');
};

// Function to get the current user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Helper function to get all users
const getUsers = (): StoredUser[] => {
  const usersJson = localStorage.getItem('users');
  return usersJson ? JSON.parse(usersJson) : [];
};
