const Group = require('../models/Group');
const Lock = require('../models/Lock');
const LocalFisico = require('../models/LocalFisico');

module.exports = {
    async index(Request, Response){
        const groups = await Group.find();
        return Response.json(groups);
    },

    async destroy(Request, Response){
        const {_id} = Request.headers;
    
        const group = await Group.findByIdAndRemove(_id);
        const holderGroup = await Group.findOneAndUpdate({content: {$in: [_id]}}, {$pullAll: {content: [_id]}}, {new: true});
        await LocalFisico.deleteMany ({holder: {$in: [_id]}});
        await Group.deleteMany ({holder: {$in: [_id]}});
        await Lock.deleteMany ({holder: {$in: [_id]}});

        return Response.json({group, holderGroup});
    },

    async Update(request, response){
        const {_id, name} = request.body;
        const group = await Group.findByIdAndUpdate (_id, {name}, {new: true});
        return response.json (group);
    },

    async show(Request, Response){
        
        const { _id } = Request.headers;
        
        const holderGroup = await Group.findById(_id).populate('content').populate('locks').populate('holder').populate('localFisico');
        
        return Response.json(holderGroup);
    },

    async store(Request, Response){
        const {name, _id = null, Localtype = "group"} = Request.body;
        

        if(Localtype==="group"){
        const holderGroup = await Group.findOne({ _id });

        let NewGroup = await Group.findOne({ name });

        if(NewGroup===null){
            
            if(holderGroup!==null){

                var newHolder = holderGroup.holder;
                newHolder.push (holderGroup._id);

                if(holderGroup.holderLocalFisico!==null){
                    NewGroup = await Group.create({
                        name,
                        holder: newHolder,
                        content: [],
                        locks: [],
                        holderLocalFisico: holderGroup.holderLocalFisico
                    });
                }
                else{
                 NewGroup = await Group.create({
                        name,
                        holder: newHolder,
                        content: [],
                        locks: [],
                    });
                }

                let newContent = holderGroup.content;
                newContent.push(NewGroup._id);
                await Group.findByIdAndUpdate({ _id: holderGroup._id}, { content: newContent}, {new: true});

                return Response.json ({NewGroup});
            }

            else{
               NewGroup = await Group.create({
                name,
                content: [],
                locks: [],
                 }); 

                return Response.json ({NewGroup});
            } 

      
    } else return Response.status(400).json({
        error: true,
        message: "Um grupo com esse nome já existe"
        });
    }

    if(Localtype==="localFisico"){
        const holderLocal = await LocalFisico.findOne({ _id });

        let NewGroup = await Group.findOne({ name });

        if(NewGroup===null){
            
            if(holderLocal!==null){

                NewGroup = await Group.create({
                    name,
                    holder: holderLocal.holder,
                    content: [],
                    locks: [],
                    holderLocalFisico: holderLocal._id
                });

                let newContent = holderLocal.groups;
                newContent.push(NewGroup._id);
                await LocalFisico.findByIdAndUpdate({ _id: holderLocal._id}, { groups: newContent}, {new: true});

                return Response.json ({NewGroup});
            }

      
    } else return Response.status(400).json({
        error: true,
        message: "Um grupo com esse nome já existe"
        });
    }
   
    }
}