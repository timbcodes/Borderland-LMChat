import Dexie from "dexie";

const db = new Dexie("ChatDatabase");
db.version(1).stores({
  chats: "++id, uuid, name",
  messages: "++id, chatId, text, timestamp",
});

export default db;
