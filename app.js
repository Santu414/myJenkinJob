const fs = require('fs');

const log = (msg) => {
    const message = `[${new Date().toISOString()}] ${msg}\n`;
    console.log(message);
    fs.appendFileSync("application.log", message);
};

log("Application started");
log(`NODE_ENV: ${process.env.NODE_ENV}`);
log(`PORT: ${process.env.PORT}`);
log(`DB_HOST: ${process.env.DB_HOST}`);
log("Application completed successfully!");