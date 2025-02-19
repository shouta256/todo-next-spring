// hooks/useTaskActions.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTaskCompletion, updateTask } from "@/lib/api";
import type { Task } from "@/app/types/Task";

interface EditTaskParams {
	taskId: number;
	updatedData: Partial<Task>;
}

/**
 * 削除 / 完了切り替え / 編集 をまとめたカスタムフック
 * - 成功時に ["tasks", userId, folderId] のクエリを再フェッチする
 */
export const useTaskActions = (userId: number, folderId: number | null) => {
	const queryClient = useQueryClient();

	// 削除
	const deleteMutation = useMutation({
		mutationFn: (taskId: number) => deleteTask(taskId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks", userId, folderId] });
		},
	});

	// 完了切り替え
	const toggleMutation = useMutation({
		mutationFn: ({
			taskId,
			completed,
		}: { taskId: number; completed: boolean }) =>
			updateTaskCompletion(taskId, completed),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks", userId, folderId] });
		},
	});

	// 編集
	const editMutation = useMutation({
		mutationFn: ({ taskId, updatedData }: EditTaskParams) =>
			// { id: taskId, ...updatedData } のように全部フィールドを PUT
			updateTask({ id: taskId, ...updatedData }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks", userId, folderId] });
		},
	});

	/** タスク削除ハンドラ */
	const handleDeleteTask = (taskId: number) => {
		deleteMutation.mutate(taskId);
	};

	/** タスク完了状態切り替えハンドラ */
	const handleToggleTask = (taskId: number, completed: boolean) => {
		toggleMutation.mutate({ taskId, completed });
	};

	/** タスク編集ハンドラ */
	const handleEditTask = (taskId: number, updatedData: Partial<Task>) => {
		editMutation.mutate({ taskId, updatedData });
	};

	return {
		handleDeleteTask,
		handleToggleTask,
		handleEditTask,
	};
};
