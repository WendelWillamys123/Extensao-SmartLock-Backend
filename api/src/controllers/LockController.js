const Lock = require ("../models/Lock");
const Group = require ("../models/Group");

module.exports = {

    async index (request, response){
        const lock = await Lock.find();
        return response.json (lock);
    },
    
    async show (request, response){
        const {_id} = request.query;
        const lock = await Lock.findById(_id);
        return response.json (lock);
    },

    async store (request, response){

        const {name, _id = null} = request.body;
        
        const holderGroup = await Group.findById(_id);

        let lock = await Lock.findOne({ name });

        if(lock===null){
            
            if(holderGroup!==null){

                var newHolder = holderGroup.holder;
                newHolder.push(holderGroup._id);

                const NewLock = await Lock.create({
                    name,
                    holder: newHolder
                });

                let newContent = holderGroup.content;
                newContent.push(NewLock._id);
                await Group.findByIdAndUpdate({ _id: holderGroup._id}, { content: newContent}, {new: true});

                return response.json ({NewLock});
            } else return response.status(400).json({
                error: true,
                message: 'O grupo no qual deseja criar a tranca não foi encontrado'
            });
        } else return response.status(400).json({
            error: true,
            message: 'Uma tranca com esse nome já existe'
        })
    },

    async Update (request, response)
    {
        const {_id, name} = request.body;
        const lock = await Lock.findByIdAndUpdate (_id, {name}, {new: true});
        return response.json (lock);
    },

    async destroy (request, response)
    {
        const {_id} = request.headers;
        const lock = await Lock.findByIdAndDelete(_id);
        var newContentGroup = await Group.findOneAndUpdate({content: {$in: [_id]}}, {$pullAll: {content: [_id]}}, {new: true});
        return response.json ({lock, newContentGroup});
    }
};