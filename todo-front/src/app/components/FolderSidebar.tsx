// app/components/FolderSidebar.tsx
"use client";

import type React from "react";
import { type RefObject, useRef, useState } from "react";
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFolder } from "../hooks/FolderContext";
import type { Folder } from "../types/Folder";
import { createFolder, deleteFolder, updateFolder } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Trash2, X } from "lucide-react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

/** Props例: 親コンポーネントから folders 一覧を渡す */
interface FolderSidebarProps {
	userId: number;
	folders: Folder[];
}

/** クリック外検知のカスタムフック */

export default function FolderSidebar({ folders, userId }: FolderSidebarProps) {
	// グローバル状態から現在の選択フォルダを取得
	const { selectedFolderId, setSelectedFolderId } = useFolder();
	const [newFolder, setNewFolder] = useState("");
	const [openMenuFolderId, setOpenMenuFolderId] = useState<number | null>(null);
	const [editFolderName, setEditFolderName] = useState("");
	const queryClient = useQueryClient();

	// フォルダ作成のミューテーション
	const createMutation = useMutation({
		mutationFn: (folderName: string) => createFolder(userId, folderName),
		onSuccess: (createdFolder) => {
			queryClient.invalidateQueries({ queryKey: ["folders", userId] });
			setSelectedFolderId(createdFolder.id);
		},
	});

	// フォルダ削除用ミューテーション
	const deleteMutation = useMutation({
		mutationFn: (folderId: number) => deleteFolder(userId, folderId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folders", userId] });
			setOpenMenuFolderId(null);
		},
	});

	// フォルダ更新用ミューテーション
	const updateMutation = useMutation({
		mutationFn: ({
			folderId,
			newName,
		}: { folderId: number; newName: string }) =>
			updateFolder(userId, folderId, newName),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folders", userId] });
			setOpenMenuFolderId(null);
		},
	});

	// "All" を選択する場合は、選択フォルダを null に設定
	const handleSelectAll = () => {
		setSelectedFolderId(null);
	};

	// 特定のフォルダを選択する場合
	const handleClickFolder = (folderId: number) => {
		setSelectedFolderId(folderId);
		setOpenMenuFolderId(null);
	};

	// 新規フォルダ作成
	const handleCreateFolder = (name: string) => {
		if (!name.trim()) return;
		createMutation.mutate(name.trim());
	};

	// 編集メニューの外側をクリックしたら閉じるための ref
	const editMenuRef = useRef<HTMLDivElement>(null);
	useOnClickOutside(editMenuRef as RefObject<HTMLElement>, () => {
		setOpenMenuFolderId(null);
	});

	return (
		<SidebarContent className="mb-5 py-4">
			<div className="flex-1 overflow-y-auto">
				<SidebarGroup>
					<SidebarGroupLabel className="text-2xl font-bold">
						Folders
					</SidebarGroupLabel>
					<SidebarGroupContent
						onClick={handleSelectAll}
						className={
							selectedFolderId === null
								? "bg-muted cursor-pointer text-lg my-2 ml-2 font-bold"
								: "hover:bg-muted/50 cursor-pointer text-lg my-2 ml-2"
						}
					>
						All
					</SidebarGroupContent>
					{folders.map((folder) => (
						<div
							key={folder.id}
							className="flex items-center justify-between relative p-2"
						>
							{/* フォルダ名部分：クリック可能エリア、flex-1 で余白を確保 */}
							<div
								onClick={() => handleClickFolder(folder.id)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										handleClickFolder(folder.id);
									}
								}}
								className={`flex-1 cursor-pointer ${
									selectedFolderId === folder.id
										? "bg-muted text-lg font-bold"
										: "hover:bg-muted/50 text-xl"
								}`}
							>
								{folder.name}
							</div>
							{/* 操作ボタン群 */}
							<div className="flex items-center space-x-1">
								<Button
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.stopPropagation();
										if (openMenuFolderId === folder.id) {
											setOpenMenuFolderId(null);
										} else {
											setOpenMenuFolderId(folder.id);
											setEditFolderName(folder.name);
										}
									}}
								>
									<MoreVertical size={16} />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.stopPropagation();
										deleteMutation.mutate(folder.id);
									}}
								>
									<Trash2 size={16} />
								</Button>
							</div>
							{openMenuFolderId === folder.id && (
								<div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10 p-2">
									<div className="flex justify-end">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => setOpenMenuFolderId(null)}
										>
											<X size={16} />
										</Button>
									</div>
									<div className="p-2">
										<Input
											value={editFolderName}
											onChange={(e) => setEditFolderName(e.target.value)}
											placeholder="New name"
											className="w-full"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													if (editFolderName.trim()) {
														updateMutation.mutate({
															folderId: folder.id,
															newName: editFolderName.trim(),
														});
													}
												}
											}}
										/>
									</div>
									<div className="flex justify-between p-2 border-t">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												if (editFolderName.trim()) {
													updateMutation.mutate({
														folderId: folder.id,
														newName: editFolderName.trim(),
													});
												}
											}}
										>
											Save
										</Button>
									</div>
								</div>
							)}
						</div>
					))}
				</SidebarGroup>
			</div>
			<SidebarGroup className="mt-4">
				<SidebarGroupLabel className="text-xl pl-0 font-bold">
					New Folder
				</SidebarGroupLabel>
				<SidebarGroupContent
					style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
				>
					<Input
						id="new-folder"
						value={newFolder}
						onChange={(e) => setNewFolder(e.target.value)}
						placeholder="Folder name"
						className="w-full"
					/>
					<Button
						variant="important"
						onClick={() => {
							if (newFolder.trim()) {
								handleCreateFolder(newFolder);
								setNewFolder("");
							}
						}}
					>
						Create Folder
					</Button>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	);
}
