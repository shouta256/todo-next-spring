"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { DisplayTask } from "../types/Task";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import TaskEditForm from "./TaskEditForm";

interface TaskListProps {
	userId: number;
	tasks: DisplayTask[];
	onDeleteTask: (taskId: number) => void;
	onToggleTask: (taskId: number, completed: boolean) => void;
	onEditTask: (task: DisplayTask, updatedData: DisplayTask) => void;
}

export default function TaskList({
	userId,
	tasks,
	onDeleteTask,
	onToggleTask,
	onEditTask,
}: TaskListProps) {
	if (!tasks || tasks.length === 0) {
		return <div>No tasks found.</div>;
	}

	return (
		<div className="space-y-4">
			{tasks.map((task) => (
				<div
					key={task.id}
					className="flex items-center justify-between border-b py-2"
				>
					<div>
						<p
							className={`font-medium ${
								task.completed ? "line-through text-gray-500" : "text-black"
							}`}
						>
							{task.title}
						</p>
						<p className="text-sm text-gray-400">{task.startTime}</p>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							onClick={() => onToggleTask(task.id, !task.completed)}
							className="text-sm"
						>
							{task.completed ? "Mark Incomplete" : "Mark Complete"}
						</Button>

						{/* 編集ポップオーバー */}
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline" className="text-sm">
									Edit
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="bg-white p-4 rounded shadow-lg"
								side="top"
								align="start"
							>
								{/* TaskEditForm に userId, task, onTaskUpdated を渡す */}
								<TaskEditForm
									userId={userId}
									task={task}
									// フォーム更新後に親へ通知
									onTaskUpdated={(updatedTask) => {
										onEditTask(task, updatedTask);
									}}
									onCancel={() => {}}
								/>
							</PopoverContent>
						</Popover>

						<Button
							variant="destructive"
							onClick={() => onDeleteTask(task.id)}
							className="text-sm"
						>
							Delete
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
