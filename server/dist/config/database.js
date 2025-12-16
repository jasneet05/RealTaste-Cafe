"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(config_1.default.mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});
// Create text indexes for search functionality
mongoose_1.default.connection.once('open', async () => {
    try {
        await Promise.all([
            mongoose_1.default.model('Product').collection.createIndex({ name: 'text', description: 'text' }),
            mongoose_1.default.model('Category').collection.createIndex({ name: 'text' })
        ]);
        console.log('Text indexes created successfully');
    }
    catch (error) {
        console.error('Error creating indexes:', error);
    }
});
