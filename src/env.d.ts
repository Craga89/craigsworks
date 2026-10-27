/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ALLOW_INDEXING?: string;
  /** Set on staging builds: the branch being previewed. */
  readonly STAGING_BRANCH?: string;
}
