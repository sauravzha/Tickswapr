import dotenv from 'dotenv';
dotenv.config();

const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
console.log("Raw Length:", serviceAccountStr ? serviceAccountStr.length : "undefined");

try {
    const serviceAccount = JSON.parse(serviceAccountStr);
    console.log("Project ID:", serviceAccount.project_id);
    const key = serviceAccount.private_key;
    console.log("Key Header:", key.substring(0, 40));
    console.log("Has real newlines?", key.includes('\n'));
    console.log("Has escaped newlines (\\\\n)?", key.includes('\\n'));
} catch (e) {
    console.error("JSON Parse Error:", e.message);
}
