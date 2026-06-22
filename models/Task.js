const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task:{
        type: String,
        required: true
    },
    completed:{
        type:Boolean,
        required: false
    }
});

taskSchema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function (doc,ret){
        delete ret._id;
    }
});

module.exports = mongoose.model('Task',taskSchema);