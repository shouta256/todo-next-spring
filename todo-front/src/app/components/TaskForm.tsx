// app/components/TaskForm.tsx
"use client";

import type React from "react";
import { useState, type FormEvent, startTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addTodo } from "../actions/addTodo";
import type { Task } from "../types/Task";

interface TaskFormProps {
	userId: number;
	folderId: number | null;
	onTaskAdded?: (task: Task) => void;
	onClose: () => void;
}

// "YYYY-MM-DDTHH:mm" の形式を返す関数
function getDefaultStartTimeLocal(): string {
	const d = new Date();
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}

type FormDataType = {
	title: string;
	taskType: string;
	priority: string;
	startTime: string;
	frequency: string;
	context: string;
};

const initialFormData: FormDataType = {
	title: "",
	taskType: "coding",
	priority: "medium",
	startTime: getDefaultStartTimeLocal(),
	frequency: "none",
	context: "",
};

type FieldConfig = {
	name: string;
	label: string;
	type: string;
	placeholder?: string;
	options?: { value: string; label: string }[];
	defaultValue?: string;
};

const fields: FieldConfig[] = [
	{
		name: "title",
		label: "Title",
		type: "text",
		placeholder: "Enter task title",
	},
	{
		name: "taskType",
		label: "Task Type",
		type: "select",
		defaultValue: "coding",
		options: [
			{ value: "coding", label: "Coding" },
			{ value: "study", label: "Study" },
			{ value: "shopping", label: "Shopping" },
			{ value: "exercise", label: "Exercise" },
		],
	},
	{
		name: "priority",
		label: "Priority",
		type: "select",
		defaultValue: "medium",
		options: [
			{ value: "high", label: "High" },
			{ value: "medium", label: "Medium" },
			{ value: "low", label: "Low" },
		],
	},
	{
		name: "startTime",
		label: "Start Time",
		type: "datetime-local",
		defaultValue: getDefaultStartTimeLocal(),
	},
	{
		name: "frequency",
		label: "Frequency",
		type: "select",
		defaultValue: "none",
		options: [
			{ value: "none", label: "None" },
			{ value: "daily", label: "Daily" },
			{ value: "weekly", label: "Weekly" },
		],
	},
	{
		name: "context",
		label: "Context",
		type: "text",
		placeholder: "Enter context",
	},
];

const TaskForm: React.FC<TaskFormProps> = ({
	userId,
	folderId,
	onTaskAdded,
	onClose,
}) => {
	const [formData, setFormData] = useState<FormDataType>(initialFormData);
	const [authToken, setAuthToken] = useState<string>("");
	useEffect(() => {
		setAuthToken(localStorage.getItem("authToken") || "");
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// useActionState でサーバーアクション addTodo をラップ
	const [state, submitAction, isPending] = useActionState<
		{ success: boolean; todo?: Task },
		FormData
	>(
		async (_, form) => {
			// フォームのエントリーをオブジェクトに変換し、必要なフィールドを追加する
			const data = Object.fromEntries(form.entries());
			data.userId = userId.toString();
			if (folderId !== null) {
				data.folderId = folderId.toString();
			}
			data.authToken = authToken;
			return await addTodo(data);
		},
		{ success: false },
	);
	const { pending } = useFormStatus();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (formData.title.trim() === "") {
			alert("Title is required");
			return;
		}
		const form = new FormData(e.currentTarget);
		startTransition(() => {
			submitAction(form);
		});
	};

	useEffect(() => {
		if (state?.success && state.todo) {
			if (onTaskAdded) {
				onTaskAdded(state.todo);
			}
			// タスク追加成功後は必ず onClose を呼び出してモーダルを閉じる
			onClose();
		}
	}, [state, onTaskAdded, onClose]);

	return (
		<form
			onSubmit={handleSubmit}
			action={submitAction}
			className="flex flex-col space-y-4 bg-white p-4 rounded-lg shadow-md"
		>
			{fields.map((field) => (
				<div key={field.name} className="flex flex-col">
					<Label htmlFor={field.name}>{field.label}</Label>
					{field.type === "select" && field.options ? (
						<select
							id={field.name}
							name={field.name}
							value={formData[field.name as keyof FormDataType]}
							onChange={handleChange}
							className="w-full border p-2 rounded"
						>
							{field.options.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					) : (
						<Input
							id={field.name}
							name={field.name}
							type={field.type}
							value={formData[field.name as keyof FormDataType]}
							onChange={handleChange}
							placeholder={field.placeholder}
							className="w-full border p-2 rounded"
						/>
					)}
				</div>
			))}
			<Button
				type="submit"
				disabled={pending || isPending}
				className="w-full bg-blue-500 text-white py-2 rounded"
			>
				{pending || isPending ? "Adding..." : "Add Task"}
			</Button>
		</form>
	);
};

export default TaskForm;
