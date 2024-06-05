export const convertToOctetStream = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

interface ChunkInfo {
  data: ArrayBuffer;
  start: number;
  end: number;
  totalSize: number;
  contentRange: string;
  contentLength: number;
}

export const chunkFile = (
  file: File,
  chunkSize: number = 200 * 1024 * 1024
): Promise<ChunkInfo[]> => {
  return new Promise<ChunkInfo[]>((resolve, reject) => {
    const chunks: ChunkInfo[] = [];
    let offset = 0;

    const readSlice = (start: number, end: number) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const chunk: ChunkInfo = {
          data: arrayBuffer,
          start,
          end: Math.min(end, file.size),
          totalSize: file.size,
          contentRange: `bytes ${start}-${Math.min(end - 1, file.size - 1)}/${
            file.size
          }`,
          contentLength: arrayBuffer.byteLength,
        };
        chunks.push(chunk);

        if (end < file.size) {
          readSlice(end, end + chunkSize);
        } else {
          resolve(chunks);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      const slice = file.slice(start, end);
      reader.readAsArrayBuffer(slice);
    };

    readSlice(offset, Math.min(chunkSize, file.size));
  });
};

export const checkExitEmailDomain = async (emailDomain: string) => {
  const response = await fetch("./disposable_email_blocklist.conf");
  const text = await response.text();
  const lines = text.split("\n");
  const formatItems = lines.map((item: string) => item.replace("\r", ""));
  const checkIncludeEmailDomain = formatItems.filter((item: string) =>
    item.includes(emailDomain)
  );

  return checkIncludeEmailDomain.length > 0;
};

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
