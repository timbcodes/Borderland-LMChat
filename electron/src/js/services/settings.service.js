import * as db from "@/database.js";

export default {
  getSettings() {
    return new Promise((resolve, reject) => {
      try {
        const rows = db.prepare("SELECT key, value FROM settings").all();
        const settings = {};
        rows.forEach((row) => {
          settings[row.key] = row.value;
        });
        resolve(settings);
      } catch (err) {
        reject(err);
      }
    });
  },
  updateSettings(settings) {
    return new Promise((resolve, reject) => {
      const updatePromises = Object.entries(settings).map(([key, value]) => {
        return new Promise((resolve, reject) => {
          try {
            db.prepare("UPDATE settings SET value = ? WHERE key = ?").run(
              value,
              key
            );
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });
      Promise.all(updatePromises)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
