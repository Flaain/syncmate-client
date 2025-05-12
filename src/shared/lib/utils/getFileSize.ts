export const getFileSize = (bytes: number) => {
    const exponent = Math.floor(Math.log(bytes) / Math.log(1024.0));

    return `${(bytes / Math.pow(1024.0, exponent)).toFixed(exponent ? 2 : 0)} ${exponent ? `${'kMGTPEZY'[exponent - 1]}B` : 'B'}`
}