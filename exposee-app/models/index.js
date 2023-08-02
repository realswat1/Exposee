import { User } from "./users.js";
import { Video } from "./video.js";
import { Gift } from "./gifts.js";
import { Wallet } from "./wallet.js";

User.hasMany(Video, { as: "videos", foreignKey: "userId" });
Video.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(Gift, { as: "gifts", foreignKey: "userId" });
Gift.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasOne(Wallet, { as: "wallet", foreignKey: "userId" });
Wallet.belongsTo(User, { as: "user", foreignKey: "userId" });

export { User, Video, Gift, Wallet };
