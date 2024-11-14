import mongoose from 'mongoose'
import config from '../../config/default.mjs'

const { Schema } = mongoose
const ownerSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Fill the description'],
        unique: true,
        trim: true,
    },
})
ownerSchema.static.checkDatabaseExists = async () => {
    const databases = await mongoose.connection.listDatabases()
    return databases.databases.some((db) => db.name === config.databaseName)
}
ownerSchema.static.checkCollectionExists = async function () {
    if (await this.checkDatabaseExists()) {
        const collections = await mongoose.connection.db.listCollections({ name: 'owners' }).toArray()
        return collections.length > 0
    } return false
}
const Owner = mongoose.model('Owner', ownerSchema)

export default Owner