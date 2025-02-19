"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTasks } from "@/lib/api";

import TaskList from "./TaskList";
import { useFolder } from "../hooks/FolderContext";
import type { DisplayTask } from "../types/Task";
import TopBar from "./TopBar";
import { useTaskActions } from "../hooks/useTaskActions";

interface TaskManagerProps {
	userId: number;
}

export default function TaskManager({ userId }: TaskManagerProps) {
	const { selectedFolderId } = useFolder();

	const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const queryClient = useQueryClient();

	const { handleDeleteTask, handleToggleTask, handleEditTask } = useTaskActions(
		userId,
		selectedFolderId,
	);

	const {
		data: tasks,
		isLoading,
		isError,
	} = useQuery<DisplayTask[]>({
		queryKey: ["tasks", userId, selectedFolderId],
		queryFn: async () => {
			const tasksData = await fetchTasks(userId as number, selectedFolderId);
			return tasksData.map((task) => ({
				...task,
			})) as DisplayTask[];
		},
		enabled: !!userId, // userId が存在する場合のみ実行
	});

	const filteredTasks = tasks?.filter((task: DisplayTask) => {
		if (filter === "all") return true;
		if (filter === "active") return !task.completed;
		if (filter === "completed") return task.completed;
		return true;
	});

	const handleTaskAdded = () => {
		setIsDialogOpen(false);
		queryClient.invalidateQueries({
			queryKey: ["tasks", userId, selectedFolderId],
		});
	};

	// ローディング・エラー表示
	if (isLoading) return <div>Loading tasks...</div>;
	if (isError) return <div>Error loading tasks</div>;

	return (
		<div className="flex flex-col w-full min-h-screen">
			<div className="flex justify-between items-center p-4">
				<TopBar
					filter={filter}
					setFilter={setFilter}
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
					userId={userId}
					handleTaskAdded={handleTaskAdded}
				/>
			</div>

			<div className="flex-1 p-4 relative">
				{filteredTasks && (
					<TaskList
						userId={userId}
						tasks={filteredTasks}
						onDeleteTask={handleDeleteTask}
						onToggleTask={handleToggleTask}
						onEditTask={(task, updatedData) =>
							handleEditTask(task.id, updatedData)
						}
					/>
				)}
			</div>
		</div>
	);
}
