export declare const convertToOctetStream: (file: File) => Promise<unknown>;
interface ChunkInfo {
    data: ArrayBuffer;
    start: number;
    end: number;
    totalSize: number;
    contentRange: string;
    contentLength: number;
}
export declare const chunkFile: (file: File, chunkSize?: number) => Promise<ChunkInfo[]>;
export declare const checkExitEmailDomain: (emailDomain: string) => Promise<boolean>;
export declare const formatAddress: (address: string) => string;
export {};
