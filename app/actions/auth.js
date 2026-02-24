'use server';
import { sql } from '@vercel/postgres';
import { cookies } from 'next/headers';

// ✅ 1. DATABASE LOGIN (No longer hardcoded)
export async function loginAction({ email, password }) { 
  try {
    // 1. Fetch user including phone_number
    const { rows } = await sql`
      SELECT * FROM users WHERE email = ${email} AND password = ${password}
    `;

    if (rows.length > 0) {
      const user = rows[0];
      const cookieStore = await cookies();
      
      // Set session cookie
      cookieStore.set('auth_token', 'true', { 
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 
      });

      // 2. ✅ RETURN THE DATA: 
      // We send back role, email, AND phone_number
      return { 
        success: true, 
        role: user.role, 
        email: user.email,
        phone_number: user.phone_number // 📱 This fixes the "GUEST" issue later
      };
    }

    return { success: false, error: "Invalid email or password!" };
  } catch (err) {
    console.error("Login Database Error:", err);
    // 💡 This was likely saying 'neon is not defined' because of a naming mixup
    return { success: false, error: "Login Error: " + err.message };
  }
}

export async function signUpAction(formData) {
  const { firstName, lastName, email, password, phoneNumber } = formData;

  try {
  
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.rowCount > 0) {
      return { success: false, error: "Email already registered!" };
    }

    // Insert new user with all fields
    await sql`
      INSERT INTO users (first_name, last_name, email, password, phone_number, role)
      VALUES (${firstName}, ${lastName}, ${email}, ${password}, ${phoneNumber}, 'user')
    `;

    return { success: true };
  } catch (err) {
    console.error("Signup Error:", err);
    return { success: false, error: "Failed to create account." };
  }
}