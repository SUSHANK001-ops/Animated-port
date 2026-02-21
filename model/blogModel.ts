import  mongoose  from "mongoose";

interface Iblog {
    slug: string;
  title: string;
  timeToRead: string;
  Titledescription: string;
  image: string;
  tags: string[];
  category: string;
  dateposted: string;
  author: string;
  content: string;
}

const BlogSchema =  new mongoose.Schema<Iblog>({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    timeToRead: { type: String, required: true },
    Titledescription: { type: String, required: true },
    image: { type: String, required: true },
    tags: { type: [String], required: true },
    category: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true }
},{ timestamps: true });


const BlogModel = mongoose.models.Blog || mongoose.model<Iblog>("Blog", BlogSchema);

export default BlogModel;