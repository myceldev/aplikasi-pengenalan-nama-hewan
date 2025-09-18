import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        mongoose.connection.on('connected', () => console.log('Sip, MongoDB nyambung!'));
        mongoose.connection.on('error', (err) => console.log('Waduh, error koneksi DB:', err));

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;