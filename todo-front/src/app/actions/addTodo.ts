'use server';

import { TodoRequestSchema } from '../schemas/todo';
import { Task } from '../types/Task';

export async function addTodo(data: Record<string, unknown>): Promise<{
  success: boolean;
  todo?: Task;
}> {
  console.log("addTodo action invoked");
  console.log("Received data:", data);

  // Zod を使ってデータを検証
  const parseResult = TodoRequestSchema.safeParse(data);
  if (!parseResult.success) {
    const errorMessages = parseResult.error.errors.map((err) => err.message).join(", ");
    throw new Error("Validation failed: " + errorMessages);
  }
  // 検証済みのデータを使用
  const validatedData = parseResult.data;

  // payload の構築
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload:any  = {
    title: validatedData.title,
    userId: validatedData.userId,
    taskType: validatedData.taskType,
    priority: validatedData.priority,
    startTime: validatedData.startTime,
    frequency: validatedData.frequency || "",
    context: validatedData.context || "",
  };

  // folderId が指定されていれば追加
  if (validatedData.folderId !== undefined) {
    payload.folderId = validatedData.folderId;
  }

  // 必要なら authToken なども追加（ここでは authToken が data に含まれていると仮定）
  const authToken = data.authToken?.toString() || "";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch("http://localhost:8080/api/todos", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Error response:", res.status, res.statusText, errorBody);
    throw new Error("Todoの追加に失敗しました: " + res.statusText + " - " + errorBody);
  }

  const newTodo = await res.json();
  // 必要に応じて、バックエンドのレスポンスを Task 型にマッピングします
  const mappedTodo: Task = {
    id: newTodo.id,
    title: newTodo.title || validatedData.title,
    taskType: newTodo.taskType || validatedData.taskType,
    priority: newTodo.priority || validatedData.priority,
    startTime: newTodo.startTime || validatedData.startTime,
    frequency: newTodo.frequency || validatedData.frequency,
    context: newTodo.context || validatedData.context,
    userId: newTodo.userId,
    folderId: newTodo.folderId,
  };

  return { success: true, todo: mappedTodo };
}
