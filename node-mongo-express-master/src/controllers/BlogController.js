const Blog = require("../schemas/Blog");

const BlogController = {
    async get (req,res) {
        const blogs = await Blog.find().populate('userId');
        res.json({
            data:blogs,
            errors:[],
            message: 'Blog fetched'
        });

    },
    async create (req,res) {
        const blog = new Blog({
            title: req.body.title,
            body: req.body.body,
            userId: req.user.id
        });
        await blog.save();
        res.json({
            data:{},
            errors:[],
            message: 'Blog created'
        });
    }
};

module.exports = BlogController;
