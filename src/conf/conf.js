const conf = {
    processId: String(import.meta.env.VITE_PROCESS_ID || process.env.VITE_PROCESS_ID || ''),
};

export default conf;
