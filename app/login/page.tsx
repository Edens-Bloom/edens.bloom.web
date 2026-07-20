"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const router = useRouter();

  const { login, isLoading, error: storeError, user } = useStore();

  useEffect(() => {
    if (user && user.role === "admin") {
      router.replace("/admin");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!username || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    const success = await login(username, password);
    if (success) {
      router.push("/admin");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: "2rem",
      }}
    >
      <div
        className="login-card"
        style={{
          background: "white",
          padding: "2.5rem",
          borderRadius: "1rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#333",
            fontSize: "1.8rem",
          }}
        >
          Admin Login
        </h2>

        {(localError || storeError) && (
          <div
            style={{
              background: "#fff5f5",
              color: "#e53e3e",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
              border: "1px solid #feb2b2",
            }}
          >
            {localError || storeError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "#666",
              }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
              placeholder="Enter username"
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: "#666",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #ddd",
                fontSize: "1rem",
              }}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: "#4a5568",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
