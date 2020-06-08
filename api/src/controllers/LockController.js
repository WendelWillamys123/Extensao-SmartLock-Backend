const Lock = require ("../models/Lock");
const Group = require ("../models/Group");
const LocalFisico = require ("../models/LocalFisico");


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

        const {name, _id = null, Localtype="group"} = request.body;
        
        if(Localtype==="group"){

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

                    let newContent = holderGroup.locks;
                    newContent.push(NewLock._id);
                    await Group.findByIdAndUpdate({ _id: holderGroup._id}, { locks: newContent}, {new: true});

                    return response.json ({NewLock});
                } else return response.status(400).json({
                    error: true,
                    message: 'O grupo no qual deseja criar a tranca não foi encontrado'
                });
            } else return response.status(400).json({
                error: true,
                message: 'Uma tranca com esse nome já existe'
            })
        }

        if(Localtype==="localFisico"){
            
            const holderLocal = await LocalFisico.findById(_id);

            let lock = await Lock.findOne({ name });

            if(lock===null){
                
                if(holderLocal!==null){

                    const NewLock = await Lock.create({
                        name,
                        holder: holderLocal.holder,
                        holderLocalFisico: holderLocal._id
                    });

                    let newContent = holderLocal.locks;
                    newContent.push(NewLock._id);
                    await LocalFisico.findByIdAndUpdate({ _id: holderLocal._id}, { locks: newContent}, {new: true});

                    return response.json ({NewLock});
                } else return response.status(400).json({
                    error: true,
                    message: 'O local físico no qual deseja criar a tranca não foi encontrado'
                });
            } else return response.status(400).json({
                error: true,
                message: 'Uma tranca com esse nome já existe'
            })
        }
    },

    async Update (request, response)
    {
        const {_id, name} = request.body;
        const lock = await Lock.findByIdAndUpdate (_id, {name}, {new: true});
        return response.json (lock);
    },

    async destroy (request, response)
    {
        const {_id, Localtype="group"} = request.headers;
        if(Localtype==="group"){
            const lock = await Lock.findByIdAndDelete(_id);
            var newContentGroup = await Group.findOneAndUpdate({locks: {$in: [_id]}}, {$pullAll: {locks: [_id]}}, {new: true});
            return response.json ({lock, newContentGroup});
        } 
        if(Localtype==="localFisico"){
            const lock = await Lock.findByIdAndDelete(_id);
            var newContentLocal = await LocalFisico.findOneAndUpdate({locks: {$in: [_id]}}, {$pullAll: {locks: [_id]}}, {new: true});
            return response.json ({lock, newContentLocal});
        }
    }
};