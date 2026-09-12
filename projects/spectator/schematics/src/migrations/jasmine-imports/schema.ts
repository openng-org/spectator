export interface Schema {
  /**
   * Limit the migration to a single workspace project. Defaults to the whole workspace.
   */
  project?: string;

  /**
   * Limit the migration to a directory. Takes precedence over `project`.
   */
  path?: string;
}
