export const taskRoutes = {
  list: () => "/",
  new: () => "/tasks/new",
  view: (id: string) => `/tasks/${id}`,
  edit: (id: string) => `/tasks/${id}/edit`,
} as const;
