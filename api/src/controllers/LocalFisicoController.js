const LocalFisico = require('../models/LocalFisico');

const Group = require('../models/Group');
const Lock = require('../models/Lock');

module.exports = {
    async index(Request, Response){
        const localFisico = await LocalFisico.find();
        return Response.json(localFisico);
    },

    async destroy(Request, Response){
        const {_id} = Request.headers;
    
        const localFisico = await LocalFisico.findByIdAndRemove(_id);
        const holderGroup = await Group.findOneAndUpdate({localFisico: {$in: [_id]}}, {$pullAll: {localFisico: [_id]}}, {new: true});
        await Group.deleteMany ({holderLocalFisico: {$in: [_id]}});
        await Lock.deleteMany ({holderLocalFisico: {$in: [_id]}});

        return Response.json({localFisico, holderGroup});
    },

    async Update(request, response){
        const {_id, name} = request.body;
        const localFisico = await LocalFisico.findByIdAndUpdate (_id, {name}, {new: true});
        return response.json (localFisico);
    },

    async show(Request, Response){
        
        const { _id } = Request.headers;
        
        const localFisico = await LocalFisico.findById(_id).populate('groups').populate('locks').populate('holder');
        
        return Response.json(localFisico);
    },

    async nameShow(Request, Response){
        const { name } = Request.query;

        const localBusca = await LocalFisico.findOne({name});

        return Response.json(localBusca);
    },

    async store(Request, Response){
        const {name, _id = null, longitude, latitude} = Request.body;
        
        const holderGroup = await Group.findOne({ _id });

        let NewLocal = await LocalFisico.findOne({ name });

        if(NewLocal===null){
            
            if(holderGroup!==null){

                var newHolder = holderGroup.holder;
                newHolder.push (holderGroup._id);

                const location = {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }

                NewLocal = await LocalFisico.create({
                    name,
                    holder: newHolder,
                    groups: [],
                    locks: [],
                    location: location
                });

                let newLocalFisico = holderGroup.localFisico;
                newLocalFisico.push(NewLocal._id);
                await Group.findByIdAndUpdate({ _id: holderGroup._id}, { localFisico: newLocalFisico}, {new: true});

                return Response.json ({NewLocal});
            }

      
    } else return Response.status(400).json({
        error: true,
        message: "Um Local fisico com esse nome já existe"
    });
   
    }
}