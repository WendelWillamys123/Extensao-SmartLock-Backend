const User = require('../models/User');

module.exports = {
    async index(Request, Response){
        const users = await User.find();
        return Response.json(users);
    },

    async destroy(Request, Response){
        const { id } = Request.headers;

        await User.deleteOne( {_id: id}, (err) => {
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
        const { _id } = Request.headers;
        const usersBusca = await User.findById(_id);

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
    
    },

    async Update(request, response){
        const {_id, nome, email, Macs, matricula} = request.body;
        console.log(_id);
        const user = await User.findByIdAndUpdate (_id, {nome, email, Macs, matricula}, {new: true});
        return response.json (user);
    },
}