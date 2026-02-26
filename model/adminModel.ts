import mongoose from 'mongoose';
interface Admin {
    _id?: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    tokens?: string[];
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;

}

const AdminSchema = new mongoose.Schema<Admin>({
    username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tokens: { type: [String], default: [] },
    role: { type: String, default: "admin" }
}, { timestamps: true })

// If the model already exists (Hot-reload / dev), remove it so schema updates take effect
if (mongoose.models && mongoose.models.Admin) {
    delete mongoose.models.Admin;
}

const AdminModel = mongoose.models.Admin || mongoose.model<Admin>("Admin", AdminSchema);

export default AdminModel;