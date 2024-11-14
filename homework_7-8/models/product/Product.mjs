import mongoose from 'mongoose'
import config from '../../config/default.mjs'

const { Schema } = mongoose
const productSchema = new Schema({
    name: {
        type: String, required: [true, 'Name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be at most 50 characters long'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price must be at least 1'],
        max: [100000, 'Price must be at most 100000'],
        toInt: true,
    },
    description: {
        type: String,
        required: [true, 'Fill the description'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
    },
    prodImage: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v ? /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v) || v.startsWith('/uploads/') : true;
            },
            message: 'Image must be a valid URL or a valid path ending with an image extension (jpg, jpeg, png, etc.)'
        }
    },
})
productSchema.static.checkDatabaseExists = async () => {
    const databases = await mongoose.connection.listDatabases()
    return databases.databases.some((db) => db.name === config.databaseName)
}
productSchema.static.checkCollectionExists = async function () {
    if (await this.checkDatabaseExists()) {
        const collections = await mongoose.connection.db.listCollections({ name: 'users' }).toArray()
        return collections.length > 0
    } return false
}
const Product = mongoose.model('Product', productSchema)

export default Product