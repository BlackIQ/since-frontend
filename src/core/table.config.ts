export interface TableConfig {
  title: string;
  fields: Record<string, string>;
}

const tables = {
  counters: {
    title: "Counters",
    fields: {
      title: "Title",
      status: "Status",
      visibility: "Visibility",
      started_at: "Started",
      update: "Edit",
      delete: "Delete",
    },
  },
} as const satisfies Record<string, TableConfig>;

export type TableName = keyof typeof tables;

export default tables;
