export interface Library {
    name: string; // ? Name of the imported library.
    description: string; // ? Description of the imported library.
    version: string; // ? Version of the imported library.
    author: string; // ? Author of the imported library.
    importedAt?: number; // Timestamp of when the library has been imported.
}
