export interface TableConfig {
  title: string;
  fields: Record<string, string>;
}

const tables = {
  table_name: {
    title: "Table Title",
    fields: {
      name: "Name",
      created_at: "Created At",
      update: "Edit",
      delete: "Delete",
    },
  },
} as const satisfies Record<string, TableConfig>;

export type TableName = keyof typeof tables;

export default tables;
