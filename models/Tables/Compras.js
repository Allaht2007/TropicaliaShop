const Sequelize = require("sequelize");
const Conexao = require("../../BancoDados/baseDados");
const CarrinhoClass = require("../Tables/CarrinhoClass");
const Compras = Conexao.define("Compras",{
    id_compras:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data_compra:{
        type: Sequelize.DATE,
        allowNull: false
    },

    endereco_entrega:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    metodo_pagamento:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    status_compra:{
        type: Sequelize.ENUM("entregue","a caminho","pendente"),
        allowNull:false,
    },

    id_info:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    id_CarrinhoClass:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
            model:CarrinhoClass,
            key:"id_carrinhoClass"
        }
    }
})
CarrinhoClass.hasOne(Compras, { 
    foreignKey: 'id_CarrinhoClass' 
});
Compras.belongsTo(CarrinhoClass, {
     foreignKey: 'id_CarrinhoClass' 
});

module.exports = Compras;