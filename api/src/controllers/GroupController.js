const Group = require('../models/Group');
const Lock = require('../models/Lock');

module.exports = {
    async index(Request, Response){
        const groups = await Group.find();
        return Response.json(groups);
    },

    async destroy(Request, Response){
        const {_id} = Request.headers;
    
        const group = await Group.findByIdAndRemove(_id);
        const otherGroups = await Group.find({holder: _id});
        const holderGroup = await Group.findOneAndUpdate({content: {$in: [_id]}}, {$pullAll: {content: [_id]}}, {new: true});
        await Group.deleteMany ({holder: {$in: [_id]}});
        await Lock.deleteMany ({holder: {$in: [_id]}});

        return Response.json({group, otherGroups, holderGroup});
    },

    async Update(request, response)
    {
        const {_id, name} = request.body;
        const group = await Group.findByIdAndUpdate (_id, {name}, {new: true});
        return response.json (group);
    },

    async show(Request, Response){
        
        const { content } = Request.headers;
        console.log(content);

        const groupsBusca = await Group.find({_id: {$in: content} });
        const locksBusca = await Lock.find({_id: {$in: content} });

        groupsBusca.push(...locksBusca);
        
        return Response.json(groupsBusca);
    },

    async nameShow(Request, Response){
        const { name } = Request.query;

        const groupsBusca = await Group.findOne({name});

        return Response.json(groupsBusca);
    },

    async store(Request, Response){
        const {name, _id = null} = Request.body;
        
        const holderGroup = await Group.findOne({ _id });

        let NewGroup = await Group.findOne({ name });

        if(NewGroup===null){
            
            if(holderGroup!==null){

                var newHolder = holderGroup.holder;
                newHolder.push (holderGroup._id);

                NewGroup = await Group.create({
                    name,
                    holder: newHolder,
                    content: [],
                });

                let newContent = holderGroup.content;
                newContent.push(NewGroup._id);
                const groupContent = await Group.findByIdAndUpdate({ _id: holderGroup._id}, { content: newContent}, {new: true});

                return Response.json ({NewGroup});
            }

            else{
               NewGroup = await Group.create({
                name,
                content: [],
                 }); 

                return Response.json ({NewGroup});
            } 

      
    } else return Response.status(400).json({
        error: true,
        message: "Um grupo com esse nome já existe"
    });
   
    }
}