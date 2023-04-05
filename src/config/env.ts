import fs from 'fs';

const envConfig = () => {
    if (!fs.existsSync("./.env")) return;

    const lines = fs.readFileSync("./.env").toString().split("\n");

    for (const line of lines) {
        if (line.startsWith("#") || line.trim() === "") continue;
        const parts = line.split("=", 2);
        if (parts.length !== 2) continue;

        const name = parts[0].trim();
        const value = parts[1].trim();
        process.env[name] = value;
    }
}

export default envConfig;
