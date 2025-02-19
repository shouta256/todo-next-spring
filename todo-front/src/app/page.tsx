// app/page.tsx (または Dashboard.tsx)
"use client";

import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import TaskManager from "./components/TaskManager";
import { fetchFolders } from "@/lib/api";
import Sidebar from "./components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import type { Folder } from "./types/Folder";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
	const [userId, setUserId] = useState<number | null>(null);
	const [userName, setUserName] = useState<string>("John Doe");
	const [isLoginTab, setIsLoginTab] = useState(true);

	useEffect(() => {
		const uidStr = localStorage.getItem("userId");
		if (uidStr) {
			setUserId(Number(uidStr));
		}
		const storedName = localStorage.getItem("userName");
		if (storedName) {
			setUserName(storedName);
		}
	}, []);

	const {
		data: folders,
		isLoading: isFoldersLoading,
		isError: isFoldersError,
	} = useQuery<Folder[]>({
		queryKey: ["folders", userId],
		queryFn: () => fetchFolders(userId ?? 0), // null の代わりに 0 を使用
	});

	// ダミーユーザープロファイル
	const userProfile = {
		name: userName,
		avatarUrl: "https://picsum.photos/80/80",
	};

	if (userId === null) {
		return (
			<div className="max-w-sm mx-auto p-4">
				<div className="flex justify-center space-x-4 mb-4">
					<Button
						onClick={() => setIsLoginTab(true)}
						className={`px-4 py-2 rounded ${isLoginTab ? "bg-gray-300" : "bg-gray-100"}`}
					>
						Login
					</Button>
					<Button
						onClick={() => setIsLoginTab(false)}
						className={`px-4 py-2 rounded ${!isLoginTab ? "bg-gray-300" : "bg-gray-100"}`}
					>
						Register
					</Button>
				</div>
				{isLoginTab ? (
					<LoginForm
						onLoginSuccess={() => {
							const uidStr = localStorage.getItem("userId");
							if (uidStr) setUserId(Number(uidStr));
							const storedName = localStorage.getItem("userName");
							if (storedName) setUserName(storedName);
						}}
					/>
				) : (
					<RegisterForm
						onRegisterSuccess={() => {
							const uidStr = localStorage.getItem("userId");
							if (uidStr) setUserId(Number(uidStr));
							const storedName = localStorage.getItem("userName");
							if (storedName) setUserName(storedName);
						}}
					/>
				)}
			</div>
		);
	}
	// フォルダ読み込み中の場合
	if (isFoldersLoading) {
		return <div>Loading folders...</div>;
	}

	// フォルダ読み込みエラーの場合
	if (isFoldersError) {
		return <div>Error loading folders.</div>;
	}

	return (
		<div className="w-full mx-auto p-4">
			<div className="flex">
				<div className="w-64">
					<Sidebar
						userProfile={userProfile}
						userId={userId}
						folders={folders || []}
						onLogout={() => {
							localStorage.removeItem("authToken");
							localStorage.removeItem("userId");
							localStorage.removeItem("userName");
							window.location.reload();
						}}
					/>
				</div>
				{/* TaskManager は残りの領域を使用 */}
				<div className="flex-1 ml-4">
					<TaskManager userId={userId} />
				</div>
			</div>
		</div>
	);
}
