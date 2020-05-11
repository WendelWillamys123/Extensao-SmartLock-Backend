const User = require('../models/User');

module.exports = {
    async index(Request, Response){
        const users = await User.find();
        return Response.json(users);
    },

    async destroy(Request, Response){
        const {_id}= Request.body;
        const user_id  = await User.deleteOne(
            {_id}, (err) => {
            if(err) return Response.status(400).json({
                error: true,
                message: "Erro ao deletar"
            });

            return Response.json({
                error: false,
                message:"Sucesso"
             })
         });
    },

    async show(Request, Response){
        const { id } = Request.query;
        let _id = id;
        const usersBusca = await User.findOne({
            _id,
        });

        return Response.json(usersBusca);
    },

    async store(Request, Response){
        const {nome, email, Macs, matricula = null, img = null} = Request.body;
        
        let Newuser = await User.findOne({ email });

        if(!Newuser){
            Newuser = await User.create({
                nome,
                email,
                Macs,
                matricula,
            })
        }
        
        
        return Response.json(Newuser);
    
    }
}