import { z } from "zod";
import { taskFormSchema } from "@/features/tasks/schemas/task.schema";

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export type TaskFormFieldName = keyof TaskFormValues;

export type TaskFormFieldErrors = Partial<Record<TaskFormFieldName, string>>;

export type TaskFormState = {
  values: TaskFormValues;
  initialValues: TaskFormValues;
  touched: Partial<Record<TaskFormFieldName, boolean>>;
};

export type TaskFormAction =
  | { type: "SET_FIELD"; name: TaskFormFieldName; value: string }
  | { type: "SET_TOUCHED"; name: TaskFormFieldName }
  | { type: "SET_ALL_TOUCHED" }
  | { type: "INIT"; values: TaskFormValues }
  | { type: "RESET" };

export const emptyTaskFormValues: TaskFormValues = {
  title: "",
  description: "",
};

export function createTaskFormState(
  initialValues: TaskFormValues = emptyTaskFormValues,
): TaskFormState {
  return {
    values: initialValues,
    initialValues,
    touched: {},
  };
}

export function taskFormReducer(
  state: TaskFormState,
  action: TaskFormAction,
): TaskFormState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        values: {
          ...state.values,
          [action.name]: action.value,
        },
      };
    case "SET_TOUCHED":
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.name]: true,
        },
      };
    case "SET_ALL_TOUCHED":
      return {
        ...state,
        touched: {
          title: true,
          description: true,
        },
      };
    case "INIT":
      return createTaskFormState(action.values);
    case "RESET":
      return {
        ...state,
        values: state.initialValues,
        touched: {},
      };
    default:
      return state;
  }
}

export function validateTaskForm(values: TaskFormValues) {
  return taskFormSchema.safeParse(values);
}

export function zodErrorToFieldErrors(error: z.ZodError): TaskFormFieldErrors {
  const result: TaskFormFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field === "title" && !result.title) result.title = issue.message;
    else if (field === "description" && !result.description) {
      result.description = issue.message;
    }
  }
  return result;
}
