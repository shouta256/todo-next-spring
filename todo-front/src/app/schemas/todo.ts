// app/schemas/todo.ts
import { z } from "zod";

export const TodoRequestSchema = z.object({
  title: z
    .string({ required_error: "Task description must not be blank" })
    .nonempty("Task description must not be blank")
    .max(255, "Task description must not exceed 255 characters"),
  userId: z.coerce.number({ required_error: "User ID is required" }),
  taskType: z.string().nonempty("Task type is required"),
  priority: z.string().nonempty("Priority is required"),
  startTime: z.string().nonempty("Start time is required"),
  frequency: z.string().optional(),
  context: z.string().optional(),
  folderId: z.coerce.number().optional(),
});
