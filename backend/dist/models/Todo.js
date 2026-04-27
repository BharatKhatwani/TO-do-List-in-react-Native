import mongoose, { Schema } from 'mongoose';
const TodoSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true,
        maxlength: 500
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
export default mongoose.model('Todo', TodoSchema);
//# sourceMappingURL=Todo.js.map