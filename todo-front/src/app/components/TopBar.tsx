"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import TaskForm from "./TaskForm";
import { useFolder } from "../hooks/FolderContext";

interface TopBarProps {
	filter: "all" | "active" | "completed";
	setFilter: (filter: "all" | "active" | "completed") => void;
	isDialogOpen: boolean;
	setIsDialogOpen: (open: boolean) => void;
	userId: number;
	handleTaskAdded: () => void;
}

export default function TopBar({
	filter,
	setFilter,
	isDialogOpen,
	setIsDialogOpen,
	userId,
	handleTaskAdded,
}: TopBarProps) {
	const { selectedFolderId } = useFolder();

	return (
		<div className="w-full p-4 flex items-center justify-between">
			<div className="flex space-x-4">
				<Button
					variant={filter === "all" ? "default" : "outline"}
					onClick={() => setFilter("all")}
					className="text-lg"
				>
					All
				</Button>
				<Button
					variant={filter === "active" ? "default" : "outline"}
					onClick={() => setFilter("active")}
					className="text-lg"
				>
					Active
				</Button>
				<Button
					variant={filter === "completed" ? "default" : "outline"}
					onClick={() => setFilter("completed")}
					className="text-lg"
				>
					Completed
				</Button>
			</div>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogTrigger asChild>
					<Button variant="important" className="p-2 rounded text-lg">
						+ Add Task
					</Button>
				</DialogTrigger>
				<DialogContent
					className="bg-white p-6 rounded-lg shadow-lg"
					aria-describedby="dialog-description"
				>
					<DialogHeader>
						<DialogTitle className="text-black">Create New Task</DialogTitle>
						<DialogDescription id="dialog-description">
							Fill in the task details below and click Save to create a new
							task.
						</DialogDescription>
					</DialogHeader>
					<TaskForm
						userId={userId}
						folderId={selectedFolderId}
						onTaskAdded={handleTaskAdded}
						onClose={() => setIsDialogOpen(false)}
					/>
					<DialogFooter>
						<Button onClick={() => setIsDialogOpen(false)}>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
