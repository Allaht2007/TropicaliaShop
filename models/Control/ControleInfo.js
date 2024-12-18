const express = require ("express");
const router = express();
const bodyParser = require("body-parser");
const Info = require("../Tables/info");
const User = require("../Tables/Usuario");
const {FuncCarrinho,controleCarrinho} = require("../Control/ControleCarrinho");

const carrinho = require("../Tables/Carrinho");
const { where } = require("sequelize");

router.use(bodyParser.urlencoded({extended:true}));

router.get("/mostraInfo",(req,res)=>{
   
    let usuario = req.session.usuario;

if (!usuario) {
    res.redirect("/cadastro");
}


Info.findOne({
    where: {
        cpf_cnpj: req.session.usuario.cpf_cnpj,
    }
}).then((infos) => {
    req.session.infos = {
        id_info: infos.id_info
    }
    
    res.render("../views/Telas/infosUser", {
        infos: infos, 
        sessInfo: {
            email: usuario.email,
            cpf_cnpj: usuario.cpf_cnpj,
            nome: usuario.nome,
        }
    });
}).catch(() => {
    res.render("../views/Telas/infosUser", {
        infos: undefined, 
        sessInfo: {
            email: usuario.email,
            cpf_cnpj: usuario.cpf_cnpj,
            nome: usuario.nome,
        }
    });
});
});


router.post("/salvarInfos", (req,res)=>{

    let dataNasc = req.body.dataNasc;
    let [dia,mes,ano] = dataNasc.split("/");
    let data = `${ano}-${mes}-${dia}`;
    
   
    Info.create({
        cep:req.body.cep,
        uf:req.body.estado,
        cidade:req.body.cidade,
        bairro:req.body.bairro,
        rua:req.body.rua,
        numero_casa:req.body.numero,
        complemento:req.body.complemento,
        cpf_cnpj:req.body.cpf_cnpj,
        data_nasc:data,
        telefone:req.body.telefone,
        afiliado:false,

    }).then((infos)=>{

        FuncCarrinho(infos.id_info);

        User.update({
            email_user: req.body.emailUser,
            nome_user: req.body.nomeUser,
            cpf_cnpj: req.body.cpf_cnpj
        },{
            where:{
                id_user:req.session.usuario.id
            }
        }).then(()=>{
            req.session.usuario={
                id:req.session.usuario.id,
                nome:req.body.nomeUser,
                email:req.body.emailUser,
                cpf_cnpj: req.body.cpf_cnpj,
            }
            req.session.save();
        
        req.session.infos = {
            id_info: infos.id_info
        }
        res.redirect("/mostraInfo"); 
        }).catch((err)=>{
            console.log(err);
        })   
    })


    

})

router.post("/editaInfos",async (req,res)=>{
    let dataNasc = req.body.dataNasc;
    let [dia,mes,ano] = dataNasc.split("/");
    let data = `${ano}-${mes}-${dia}`;

    let id = req.session.usuario.id;

    User.update({
        email_user: req.body.emailUser,
        nome_user: req.body.nomeUser,
        cpf_cnpj: req.body.cpf_cnpj
    },{
        where:{
            id_user:req.session.usuario.id
        }
    }).then(()=>{
        req.session.usuario={
            id:id,
            nome:req.body.nomeUser,
            email:req.body.emailUser,
            cpf_cnpj: req.body.cpf_cnpj
        }
        req.session.save();
    })
    await Info.update({
        cep:req.body.cep,
        uf:req.body.estado,
        cidade:req.body.cidade,
        bairro:req.body.bairro,
        rua:req.body.rua,
        numero_casa:req.body.numero,
        complemento:req.body.complemento,
        cpf_cnpj:req.body.cpf_cnpj,
        data_nasc:data,
        telefone:req.body.telefone,
        afiliado:false,
    },
    {
        where:{
            id_info:req.session.infos.id_info,
        }
    })
    res.redirect("/mostraInfo");    
});


module.exports = router;
