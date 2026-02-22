import mongoose from 'mongoose';
interface Admin {
    username: string;
    email: string;
    password: string;

}

const AdminSchema = new mongoose.Schema<Admin>({
    username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

const AdminModel = mongoose.models.Admin || mongoose.model<Admin>("Admin", AdminSchema);

export default AdminModel;