"use client";

import React from "react";
import {
	Sidebar as ShadcnSidebar,
	SidebarProvider,
	SidebarHeader,
	SidebarContent,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import FolderSidebar from "./FolderSidebar";
import type { Folder } from "../types/Folder";

// ユーザープロファイル例
type UserProfile = {
	name: string;
	avatarUrl?: string;
};

interface SidebarProps {
	userProfile: UserProfile;
	userId: number;
	folders: Folder[];
	onLogout: VoidFunction;
}

export default function Sidebar({
	userProfile,
	userId,
	folders,
	onLogout,
}: SidebarProps) {
	return (
		<SidebarProvider>
			<ShadcnSidebar className="w-64 bg-white flex flex-col">
				{/* --- ヘッダー --- */}
				<SidebarHeader className="p-4 border-b">
					<div className="flex items-center space-x-2">
						{userProfile.avatarUrl && (
							<div className="relative w-12 h-12">
								<Image
									src={userProfile.avatarUrl}
									alt="avatar"
									fill
									className="rounded-full object-cover"
								/>
							</div>
						)}
						<span className="text-lg font-bold ">{userProfile.name}</span>
					</div>
				</SidebarHeader>

				{/* --- コンテンツ部分 (FolderSidebar をネスト) --- */}
				<SidebarContent className="flex-1 overflow-auto">
					<FolderSidebar userId={userId} folders={folders} />
				</SidebarContent>

				{/* --- フッター部分 --- */}
				<SidebarFooter className="p-4 border-t">
					<Button variant="outline" onClick={onLogout}>
						Logout
					</Button>
				</SidebarFooter>
			</ShadcnSidebar>
		</SidebarProvider>
	);
}
