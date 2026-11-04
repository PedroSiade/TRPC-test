"use client";

import { useCallback, useMemo, useReducer, type FormEvent } from "react";
import {
  createTaskFormState,
  emptyTaskFormValues,
  taskFormReducer,
  validateTaskForm,
  zodErrorToFieldErrors,
  type TaskFormFieldErrors,
  type TaskFormFieldName,
  type TaskFormState,
  type TaskFormValues,
} from "./task-form-reducer";

export type TaskFormField = {
  value: string;
  isDirty: boolean;
  error: string | undefined;
  setValue: (value: string) => void;
  onBlur: () => void;
};

type UseTaskFormOptions = {
  initialValues?: TaskFormValues;
};

function visibleFieldError(
  name: TaskFormFieldName,
  state: TaskFormState,
  fieldErrors: TaskFormFieldErrors,
): string | undefined {
  if (!state.touched[name]) return undefined;
  return fieldErrors[name];
}

export function useTaskForm(options?: UseTaskFormOptions) {
  const [state, dispatch] = useReducer(
    taskFormReducer,
    options?.initialValues ?? emptyTaskFormValues,
    (initial) => createTaskFormState(initial),
  );

  const fieldErrors = useMemo(() => {
    const parsed = validateTaskForm(state.values);
    return parsed.success ? {} : zodErrorToFieldErrors(parsed.error);
  }, [state.values]);

  const init = useCallback((values: TaskFormValues) => {
    dispatch({ type: "INIT", values });
  }, []);

  const fields = useMemo((): { title: TaskFormField; description: TaskFormField } => {
    const bind = (name: TaskFormFieldName): TaskFormField => ({
      value: state.values[name],
      isDirty: state.values[name] !== state.initialValues[name],
      error: visibleFieldError(name, state, fieldErrors),
      setValue: (value: string) => {
        dispatch({ type: "SET_FIELD", name, value });
      },
      onBlur: () => {
        dispatch({ type: "SET_TOUCHED", name });
      },
    });

    return {
      title: bind("title"),
      description: bind("description"),
    };
  }, [state, fieldErrors]);

  const isDirty =
    state.values.title !== state.initialValues.title ||
    state.values.description !== state.initialValues.description;

  const handleSubmit = useCallback(
    (onValid: (data: TaskFormValues) => void) => (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const parsed = validateTaskForm(state.values);
      if (!parsed.success) {
        dispatch({ type: "SET_ALL_TOUCHED" });
        return;
      }

      onValid(parsed.data);
    },
    [state.values],
  );

  return {
    fields,
    isDirty,
    init,
    handleSubmit,
  };
}
