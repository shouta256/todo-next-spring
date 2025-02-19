"use client";

import type React from "react";
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DisplayTask } from "../types/Task";
import { useFolder } from "../hooks/FolderContext";
import { useTaskActions } from "../hooks/useTaskActions";

/** TaskEditFormProps */
interface TaskEditFormProps {
	userId: number;
	task: DisplayTask;
	onTaskUpdated: (updatedTask: DisplayTask) => void;
	onCancel: () => void;
}

/** "YYYY-MM-DDTHH:mm" の形式を返す関数 */
function toDateTimeLocalString(isoString?: string): string {
	if (!isoString) return "";
	// たとえば "2025-02-10T14:25:00Z" → "2025-02-10T14:25"
	const date = new Date(isoString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
	userId,
	task,
	onTaskUpdated,
	onCancel,
}) => {
	// FolderContext から現在のフォルダIDを取得
	const { selectedFolderId } = useFolder();
	// 全項目の state を用意 (新規作成フォームと同等)
	const [title, setTitle] = useState(task.title);
	const [taskType, setTaskType] = useState(task.taskType || "coding");
	const [priority, setPriority] = useState(task.priority || "medium");
	// ここでは "YYYY-MM-DDTHH:mm" 形式の文字列に変換して表示
	const [startTime, setStartTime] = useState(
		task.startTime ? toDateTimeLocalString(task.startTime) : "",
	);
	const [frequency, setFrequency] = useState(task.frequency || "none");
	const [context, setContext] = useState(task.context || "");

	// ミューテーション: useTaskActions
	const { handleEditTask } = useTaskActions(userId, selectedFolderId);

	/** フォーム送信 */
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		// startTime を UTC ISO 形式などに変換したい場合はここで変換
		// サーバーが "YYYY-MM-DDTHH:mm" をそのまま受け取れるなら、そのままでも可
		let finalStartTime = startTime;
		if (startTime) {
			const d = new Date(startTime);
			finalStartTime = d.toISOString(); // 例: "2025-02-10T14:25:00.000Z"
			// サーバーがローカル日時しか受け付けないなら toDateTimeLocalString など調整
		}

		// handleEditTask に全項目を渡す
		await handleEditTask(task.id, {
			// 必須: サーバーが @NotNull や @NotBlank で要求しているなら全部入れる
			userId, // 既存タスクにも userId は必要
			folderId: selectedFolderId ?? undefined,
			title: title.trim(),
			taskType,
			priority,
			startTime: finalStartTime,
			frequency,
			context,
		});

		// 親コンポーネントへ「ローカル上の表示を更新」通知
		onTaskUpdated({
			...task,
			title: title.trim(),
			taskType,
			priority,
			startTime: finalStartTime,
			frequency,
			context,
			folderId: selectedFolderId || undefined,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-64">
			{/* Title */}
			<div className="flex flex-col">
				<Label htmlFor="edit-title">Title</Label>
				<Input
					id="edit-title"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Edit task title"
					className="w-full"
				/>
			</div>

			{/* TaskType (select) */}
			<div className="flex flex-col">
				<Label htmlFor="taskType">Task Type</Label>
				<select
					id="taskType"
					value={taskType}
					onChange={(e) => setTaskType(e.target.value)}
					className="border p-2 rounded"
				>
					<option value="coding">Coding</option>
					<option value="study">Study</option>
					<option value="shopping">Shopping</option>
					<option value="exercise">Exercise</option>
				</select>
			</div>

			{/* Priority (select) */}
			<div className="flex flex-col">
				<Label htmlFor="priority">Priority</Label>
				<select
					id="priority"
					value={priority}
					onChange={(e) => setPriority(e.target.value)}
					className="border p-2 rounded"
				>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
			</div>

			{/* StartTime (datetime-local) */}
			<div className="flex flex-col">
				<Label htmlFor="startTime">Start Time</Label>
				<Input
					id="startTime"
					type="datetime-local"
					value={startTime}
					onChange={(e) => setStartTime(e.target.value)}
				/>
			</div>

			{/* Frequency (select) */}
			<div className="flex flex-col">
				<Label htmlFor="frequency">Frequency</Label>
				<select
					id="frequency"
					value={frequency}
					onChange={(e) => setFrequency(e.target.value)}
					className="border p-2 rounded"
				>
					<option value="none">None</option>
					<option value="daily">Daily</option>
					<option value="weekly">Weekly</option>
				</select>
			</div>

			{/* context (text) */}
			<div className="flex flex-col">
				<Label htmlFor="context">Context</Label>
				<Input
					id="context"
					type="text"
					value={context}
					onChange={(e) => setContext(e.target.value)}
					placeholder="Enter context"
					className="w-full"
				/>
			</div>

			<div className="flex justify-end space-x-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" variant="default">
					Save
				</Button>
			</div>
		</form>
	);
};

export default TaskEditForm;
