// app/components/LoginForm.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type LoginFormProps = {
	onLoginSuccess: () => void;
};

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch(`${API_URL}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});
			if (!res.ok) {
				throw new Error("Login failed");
			}
			const data = await res.json();
			console.log("Received token:", data.token);
			console.log("Name:", data.name);
			localStorage.setItem("authToken", data.token);
			localStorage.setItem("userId", data.id.toString());
			localStorage.setItem("userName", data.username);
			setMessage(`Login successful: ${data.username}`);
			onLoginSuccess();
		} catch (err: unknown) {
			setMessage(err instanceof Error ? err.message : 'An error occurred');
		}
	};

	return (
		<Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, mt: 2 }}>
			<Typography variant="h5" sx={{ mb: 2, color: "black" }}>
				Login
			</Typography>
			<form onSubmit={handleLogin}>
				<TextField
					label="Username"
					variant="outlined"
					fullWidth
					margin="normal"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					InputLabelProps={{ style: { color: "black" } }}
					inputProps={{ style: { color: "black" } }}
				/>
				<TextField
					label="Password"
					type="password"
					variant="outlined"
					fullWidth
					margin="normal"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					InputLabelProps={{ style: { color: "black" } }}
					inputProps={{ style: { color: "black" } }}
				/>
				<Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
					Login
				</Button>
			</form>
			{message && (
				<Typography sx={{ mt: 2, color: "black" }}>{message}</Typography>
			)}
		</Box>
	);
}
