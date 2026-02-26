"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  // Changed 'username' to 'email' to match your backend req.json()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send email and password as expected by your POST route
      const response = await axios.post("/api/loginAdmin", { email, password });

      // This pulls the 'token' from your return NextResponse.json({ ..., token })
      const { token, admin, message } = response.data;

      if (token) {
        console.log("Login Success:", message);

        
        //  Store user info (optional, helpful for displaying "Welcome, Admin")
        localStorage.setItem("adminUser", JSON.stringify(admin));

        alert("Welcome back, " + admin.username);

        // 3. Redirect to dashboard (if using Next.js router)
        // router.push('/admin/dashboard');
        router.push("/adminDashboard");
      }
    } catch (error: any) {
      // Handles the 400, 401, or 500 errors from your backend
      const errorMsg = error.response?.data?.error || "Login failed";
      console.error("Login error:", errorMsg);
      alert(errorMsg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col">
        <input
          type="email"
          placeholder="Admin Email"
          className="border-2 border-gray-300 rounded-md p-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border-2 border-gray-300 rounded-md p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
