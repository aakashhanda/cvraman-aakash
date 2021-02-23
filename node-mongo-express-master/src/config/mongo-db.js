const mongoose = require('mongoose');

// replace here your live mongodb url
// const MONGOURI = 'mongodb://localhost:27017/cv_raman';
const MONGOURI = 'mongodb+srv://dev:mongo123@cluster0.f8vmc.mongodb.net/cv_raman?retryWrites=true&w=majority'

const InitMongo = async () => {
    try {
        await mongoose.connect(MONGOURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to mongodb!!')
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = InitMongo;
