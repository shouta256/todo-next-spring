// app/components/RegisterForm.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type RegisterFormProps = {
	onRegisterSuccess: VoidFunction;
};

export default function RegisterForm({ onRegisterSuccess }: RegisterFormProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch(`${API_URL}/api/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});
			if (!res.ok) {
				throw new Error("Registration failed");
			}
			const data = await res.json();
			// 保存するトークンとユーザーIDを localStorage にセット
			localStorage.setItem("authToken", data.token);
			localStorage.setItem("userId", data.id.toString());
			localStorage.setItem("userName", data.username.toString());
			setMessage(`Registration successful: ${data.username}`);
			onRegisterSuccess();
		} catch (err) {
			setMessage(err instanceof Error ? err.message : "Registration failed");
		}
	};

	return (
		<Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, mt: 2 }}>
			<Typography variant="h5" sx={{ mb: 2, color: "black" }}>
				Register
			</Typography>
			<form onSubmit={handleRegister}>
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
					Register
				</Button>
			</form>
			{message && (
				<Typography sx={{ mt: 2, color: "black" }}>{message}</Typography>
			)}
		</Box>
	);
}
