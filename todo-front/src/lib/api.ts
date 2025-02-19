// app/lib/api.ts
import type { Folder } from "@/app/types/Folder";
import type { Task } from "@/app/types/Task";

export const API_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// クライアントサイドでのみ localStorage を参照するためのヘルパー
function getAuthToken(): string {
	return typeof window !== "undefined"
		? localStorage.getItem("authToken") || ""
		: "";
}

export const fetcherWithAuth = (url: string) => {
	const token = getAuthToken();
	return fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: token ? `Bearer ${token}` : "",
		},
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Error ${res.status}: ${res.statusText}`);
		}
		return res.json();
	});
};

/**
 * JWT トークン付きでフォルダ一覧を取得する関数
 * @param userId ユーザーID
 * @returns フォルダ一覧の JSON データ
 */
export const fetchFolders = async (userId: number) => {
	const token = getAuthToken();
	const res = await fetch(`${API_URL}/api/folders?userId=${userId}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: token ? `Bearer ${token}` : "",
		},
	});
	if (!res.ok) {
		throw new Error(`Error ${res.status}: ${res.statusText}`);
	}
	return res.json();
};

/**
 * JWT トークン付きで新規フォルダを作成する関数
 * @param userId ユーザーID
 * @param name フォルダ名
 * @returns 作成されたフォルダの JSON データ
 */
export const createFolder = async (userId: number, name: string) => {
	const token = getAuthToken();
	const res = await fetch(`${API_URL}/api/folders`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: token ? `Bearer ${token}` : "",
		},
		body: JSON.stringify({ name, userId }),
	});
	if (!res.ok) {
		throw new Error(`Failed to create folder: ${res.statusText}`);
	}
	return res.json();
};

/**
 * フォルダ削除 API
 * @param userId ユーザーID
 * @param folderId フォルダID
 */
export async function deleteFolder(
	userId: number,
	folderId: number,
): Promise<void> {
	const token = getAuthToken();
	const res = await fetch(
		`${API_URL}/api/folders/${folderId}?userId=${userId}`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: token ? `Bearer ${token}` : "",
			},
		},
	);
	if (!res.ok) {
		throw new Error(`Failed to delete folder: ${res.statusText}`);
	}
}

/**
 * フォルダ更新 API
 * @param userId ユーザーID
 * @param folderId フォルダID
 * @param newName 新しいフォルダ名
 * @returns 更新後のフォルダの JSON データ
 */
export async function updateFolder(
	userId: number,
	folderId: number,
	newName: string,
): Promise<Folder> {
	const token = getAuthToken();
	const res = await fetch(
		`${API_URL}/api/folders/${folderId}?userId=${userId}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: token ? `Bearer ${token}` : "",
			},
			body: JSON.stringify({ name: newName }),
		},
	);
	if (!res.ok) {
		throw new Error(`Failed to update folder: ${res.statusText}`);
	}
	return res.json();
}

/**
 * タスク一覧の取得
 * @param userId ユーザーID
 * @param folderId フォルダID（null の場合は全タスク）
 * @returns タスク一覧
 */
export async function fetchTasks(
	userId: number,
	folderId: number | null,
): Promise<Task[]> {
	const token = getAuthToken();
	const url = folderId
		? `${API_URL}/api/todos?userId=${userId}&folderId=${folderId}`
		: `${API_URL}/api/todos?userId=${userId}&all=true`;
	const res = await fetch(url, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: token ? `Bearer ${token}` : "",
		},
	});
	if (!res.ok) {
		throw new Error("Error fetching tasks");
	}
	return res.json();
}

//タスク編集
export async function updateTask(
	task: Partial<Task> & { id: number },
): Promise<Task> {
	const token = getAuthToken();
	const res = await fetch(`${API_URL}/api/todos/${task.id}`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: token ? `Bearer ${token}` : "",
		},
		body: JSON.stringify({
			title: task.title,
			userId: task.userId,
			taskType: task.taskType,
			priority: task.priority,
			startTime: task.startTime,
			frequency: task.frequency,
			context: task.context,
			folderId: task.folderId,
		}),
	});
	if (!res.ok) {
		throw new Error(`Error updating task: ${res.statusText}`);
	}
	return res.json();
}

/**
 * タスク削除
 * @param taskId タスクID
 */
export async function deleteTask(taskId: number): Promise<void> {
	const token = getAuthToken();
	const res = await fetch(`${API_URL}/api/todos/${taskId}`, {
		method: "DELETE",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: token ? `Bearer ${token}` : "",
		},
	});
	if (!res.ok) {
		throw new Error("Error deleting task");
	}
}

/**
 * タスク完了状態の切替
 * @param taskId タスクID
 * @returns 更新後のタスク
 */
export async function updateTaskCompletion(
	taskId: number,
	completed: boolean,
): Promise<Task> {
	const token = getAuthToken();
	const endpoint = completed ? "complete" : "incomplete";
	const res = await fetch(`${API_URL}/api/todos/${taskId}/${endpoint}`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: token ? `Bearer ${token}` : "",
		},
	});
	if (!res.ok) {
		throw new Error(`Error updating task completion: ${res.statusText}`);
	}
	return res.json();
}
