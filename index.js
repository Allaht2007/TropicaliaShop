require('dotenv').config();

const express = require("express");
const Conexao = require("./BancoDados/baseDados");
const session = require("express-session");
const app = express();
const {Op} = require("sequelize");
const ngrok = require('@ngrok/ngrok');
const http = require('http');

const Classificado = require("./models/Tables/Classificado");
const Info = require("./models/Tables/info");
const Categ = require("./models/Tables/Categoria");


const controleAdm = require("./models/Control/ControleAdm");
const controleusers = require("./models/Control/controleUsers");
const controleInfo = require("./models/Control/ControleInfo");
const controleFav = require("./models/Control/ControleFav");

const controleClassificado = require("./models/Control/ControleClassificado")
const {controleCompras,finalizarCompra} = require("./models/Control/ControleCompras");
const controleAvaliacao = require("./models/Control/ControleAvaliacao");
const {FuncCarrinho,controleCarrinho} = require("./models/Control/ControleCarrinho");
const controleCategoria = require("./models/Control/ControleCategoria");
const controleCarrinhoClass = require("./models/Control/ControleCarrinhoClass");

const sync = require("./models/sync");

app.use(session({
    secret:"3RMT2AGrVgPs4LGr5OFhN",
    resave:false,
    saveUninitialized:false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365}
}))

const carregarCategorias = async (req, res, next) => {
  try { 
   const categorias = await Categ.findAll({
    order:[["nome_categ","ASC"]]
   }); 
   res.locals.categorias = categorias.map(categoria => categoria.dataValues);
    next(); 
   } catch (error) { 
   console.error(error); 
   next(error); 
 } 
};
app.use(carregarCategorias);

app.set("view engine","ejs");
app.use(express.static("public"));

app.use("/", controleCarrinho);
app.use("/", controleCompras);
app.use("/", controleCategoria);
app.use("/", controleClassificado);

app.use("/", controleusers);
app.use("/", controleInfo);
app.use("/", controleFav);
app.use("/", controleAvaliacao);
app.use("/", controleCarrinhoClass);
app.use("/", controleAdm);




Conexao.authenticate().then(()=>{  
    console.log("Servidor rodando");
}).catch((erro)=>{
    console.log(erro);
})


//Configurando o Multer

app.get("/", async(req,res)=>{
  if (!req.session.usuario || req.session.usuario.tipo != "admin") {
  
  try {
    const FilterVenda = await Classificado.findAll({
      where: { qnt_prod: { [Op.gt]: 0 },
      status_prod: "visivel" 
  }, // Adicionando condição para quantidade maior que 0
      order: [['qnt_vendas', 'DESC']],
      limit: 20,
    });

    const FilterViews = await Classificado.findAll({
      where: { qnt_prod: { [Op.gt]: 0 },
      status_prod: "visivel"  
    }, // Adicionando condição para quantidade maior que 0
      order: [['qnt_views', 'DESC']],
      limit: 20,
    });

    const FilterAssociado = await Classificado.findAll({
      include: [{
        model: Info,
        where: { 
        afiliado: true, 
        
        },
      }],
      where: { qnt_prod: { [Op.gt]: 0 },
      status_prod: "visivel"
   }, // Adicionando condição para quantidade maior que 0
      order: [['data_public', 'DESC']],
      limit: 20,
    });

    const FilterCateg = await Classificado.findAll({
      include: [{
        model: Categ,
        where: { tipo_categ: "acessorio",
        
         },
      }],
      where: { qnt_prod: { [Op.gt] : 0 },
      status_prod: "visivel"
    }, // Adicionando condição para quantidade maior que 0
      order: [['data_public', 'DESC']],
      limit: 20,
    });
      
  
      res.render("../views/index",{
        ClassAssociado:FilterAssociado,
        ClassVendas:FilterVenda,
        ClassViews:FilterViews,
        ClassCateg:FilterCateg,
       
      })
    }catch(err){
      console.log(err);
    }
  }else{
    res.redirect("/homeAdm");
  }
  
  });

  
app.listen(3000,()=>{
    console.log("Servidor Rodando");
});


// // Create webserver
// http.createServer((req, res) => {
// 	res.writeHead(200, { 'Content-Type': 'text/html' });
// 	res.end('Congrats you have created an ngrok web server');
// }).listen(3000, () => console.log('Node.js web server at 3000 is running...'));

// // Get your endpoint online
// ngrok.connect({ addr: 3000, authtoken_from_env: true })
// 	.then(listener => console.log(`Ingress established at: ${listener.url()}`));

//ngrok.connect({
  //addr:3000,
  //authtoken_from_env:true,
  //domain: 'ultimate-redfish-routinely.ngrok-free.app'
//}).then(listener => console.log(`Ingress established at: ${listener.url()}`));