import { z } from 'zod';

// Schema for task validation
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title is too long (max 100 characters)" }),
  description: z
    .string()
    .max(500, { message: "Description is too long (max 500 characters)" })
    .optional()
    .or(z.literal('')),
  priority: z
    .enum(["High", "Medium", "Low"], { 
      message: "Priority must be High, Medium, or Low" 
    })
    .default("Medium"),
  status: z
    .enum(["Todo", "In Progress", "Done"], {
      message: "Status must be Todo, In Progress, or Done"
    })
    .default("Todo"),
  dueDate: z
    .date()
    .optional()
    .nullable()
    .refine(date => {
      // If there's a date, it should be today or in the future
      if (date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      }
      return true;
    }, { message: "Due date must be today or in the future" }),
}); 