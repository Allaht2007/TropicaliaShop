const Sequelize = require("sequelize");
const Conexao = require("../../BancoDados/baseDados");
const Categ = require("./Categoria")
const Info = require("./info");
const { FOREIGNKEYS } = require("sequelize/lib/query-types");
const Classificado = Conexao.define("Classificado",{

    id_classificado:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome_prod:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    qnt_prod:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    preco_prod:{
        type: Sequelize.DOUBLE,
        allowNull:false
    },
    desc_prod:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    data_public:{
        type: Sequelize.DATE,
        allowNull: false,
    },
    qnt_vendas:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    qnt_views:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    imagens:{
        type: Sequelize.STRING,
        allowNull:false
    },
    status_prod:{
        type: Sequelize.ENUM("visivel","excluido"),
        allowNull:false
    },
    id_categ:{
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
            model: Categ,
            key:"id_categoria"
        }
    },
    id_info:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
            model: Info,
            key: "id_info"
        }

    }
});

Info.hasMany(Classificado,{
    foreignKey: "id_info",
});
Classificado.belongsTo(Info,{
    foreignKey: "id_info",
});

Categ.hasMany(Classificado,{
    foreignKey:"id_categ",
})
Classificado.belongsTo(Categ,{
    foreignKey:"id_categ",
})

module.exports = Classificado;

