export interface ConfigI{
    client_pass: string,
    frontend_pass: string,
    port: number,
    dbUrl: string,
    publicPath: string,
    filesPath: string,
    maxFileSizeInMb: number,
    acceptableFileFormat: string
}