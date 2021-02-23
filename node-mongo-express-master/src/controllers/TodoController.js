const { validationResult } = require("express-validator");
const { update } = require("../schemas/User");
const User = require("../schemas/User");

const TodoController = {
    async create(req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                data: {},
                errors: errors.array(),
                message: 'Unable to create todo item'
            });
        }
        try {
            const user = await User.findById(req.user.id);
            user.todos.push({
                title: req.body.title
            });
            await user.save();
            res.json({
                data:user,
                errors:[],
                message: 'Todo item created'
            })
        } catch (e) {
            res.send('Error in fetching')
        }
    },

    async update(req,res) { 
        await User.findOneAndUpdate(
            { "_id": req.user.id, "todos._id":  req.params.id },
            {
                "$set": {
                    "todos.$": {title:req.body.title}
                }
            },
            async (err, item)=>{
                const user = await User.findById(req.user.id);
                res.json({
                    data:user,
                    errors:[],
                    message: 'Todo item updated'
                });
            }
        );  
    },

    async delete(req,res) {
        const user = await User.findById(req.user.id);
        user.todos.id(req.params.id).remove();
        await user.save();
        res.json({
            data:{},
            errors:[],
            message: 'Todo item delete'
        });
    }
};

module.exports = TodoController;
