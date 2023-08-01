import { User } from './users.js'
import { Video } from './video.js'

User.hasMany(Video, { as: 'videos', foreignKey: 'userId' })
Video.belongsTo(User, { as: 'user', foreignKey: 'userId' })

export { User, Video }
