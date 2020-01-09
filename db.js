//var pg = require('pg');
//pg.defaults.ssl = true;
const Sequelize = require('sequelize');
//const bcrypt = require('bcrypt');

var forcebb = false;
const _UTILS = require('./utils');

/*const sequelize = new Sequelize('proton', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    omitNull: true,
    ssl: true,
    pool: { max: 5, min: 0, acquire: 30000, idle: 20000 },


});*/
const sequelize = new Sequelize('hJc21fUjxD', 'hJc21fUjxD', 'N6tPeBXUgW', {
    host: 'remotemysql.com',
    dialect: 'mysql',
    operatorsAliases: false,
    omitNull: true,
    ssl: true,
    pool: { max: 5, min: 0, acquire: 30000, idle: 20000 },


});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const USER = sequelize.define('user', {
    name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true } },
    password: { type: Sequelize.STRING, allowNull: false }
}, {
    hooks: {
        beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            //user.password = bcrypt.hashSync(user.password, salt);
        }
    },
    instanceMethods: {
        validPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        }
    }
});


const PRODUCT = sequelize.define('product', {
    name: { type: Sequelize.STRING, allowNull: false },
});
const SALE = sequelize.define('sale', {
    yr: { type: Sequelize.INTEGER, allowNull: false },
    amount: { type: Sequelize.DECIMAL, allowNull: false },
});

const DEMAND_OF_SUPLIMENTARY = sequelize.define('demand_of_suplimentary', {
    percentage: { type: Sequelize.FLOAT, allowNull: false },
    states: { type: Sequelize.ENUM, values: ['incr', 'decr'], allowNull: false }
});

const INCOME = sequelize.define('income', {
    percentage: { type: Sequelize.FLOAT, allowNull: false },
    states: { type: Sequelize.ENUM, values: ['incr', 'decr'], allowNull: false }
});

PRODUCT.hasMany(SALE);
SALE.belongsTo(PRODUCT, { foreignKey: 'productId' });

sequelize.sync({ force: forcebb }).then(() => {
    // Table created
    //return model.create();
    //insertSupplier("MPEGLA");
});
const MODELS = {
    SALE,
    PRODUCT,
    USER,
    DEMAND_OF_SUPLIMENTARY,
    INCOME,
};

function checkModel(model) {

    return MODELS[model];
}
const _DB = {
    sequelize: sequelize,
    MODELS: MODELS,
    createModel: function(model, qry, callback) {
        console.log(model);
        if (model) {
            model = model.toUpperCase();
        }
        if (checkModel(model)) {
            console.log("=======================================================================================");
            MODELS[model].create(qry).then(result => {
                callback(result);
            });
        } else {

        }

    },
   findModelById: (model, id, callback) => {
        if (model) {
            model = model.toUpperCase();
        }
        if (checkModel(model)) {
           let qry={ where: {id}};
           console.log(qry);
            MODELS[model].findAll(qry).then((results) => {
                console.log(results[0].dataValues);
                callback(results[0].dataValues);
            });
        }
    },
    findOrCreateModel: function(model, qry, callback) {
        if (model) {
            model = model.toUpperCase();
        }
        if (checkModel(model)) {
            MODELS[model].findOrCreate({ where: qry }).then(([row, isCreated]) => {
                callback(row.get({ plain: true }), isCreated);
            });
        }

    },
    findAndCountAllModel: function(model, qry, callback) {
        if (model) {
            model = model.toUpperCase();
        }
        if (checkModel(model)) {
            MODELS[model].findAndCountAll(qry).then(results => {
                callback(results);
            });
        }
    },
    findModelAll: function(model, qry, callback) {
        if (model) {
            model = model.toUpperCase();
        }
        if (checkModel(model)) {
            MODELS[model].findAll(qry).then(results => {
                callback(results);
            });
        }
    },
    bulkCreateModels: function(model, dataArr, callback) {
        if (model) {
            model = model.toUpperCase();
        }
        if (checkModel(model)) {
            MODELS[model].bulkCreate(dataArr, { validate: true }).then((results) => {
                console.log('notes created');
                callback(results);
            }).catch((err) => {
                console.log('failed to create notes');
                console.log(err);
            }).finally(() => {
                //sequelize.close();
            });
        }
    },
    findModel: function(model, qry, callback) {
        if (model) {
            model = model.toUpperCase();
        }
        if (checkModel(model)) {
            MODELS[model].findOne(qry).then(results => {
                callback(results);
            });
        }
    },
    
    updateModel: function(model, qry, data, callback) {
        if (model) {
            model = model.toUpperCase();
        }
        if (checkModel(model)) {
            MODELS[model].update(qry, { where: data }).then(() => {
                callback();
            });
        }
    },
    deleteModel: function(model, qry, callback) {
        if (model) {
            model = model.toUpperCase();
        }
        if (checkModel(model)) {
            MODELS[model].destroy({
                where: qry
            }).then(() => {
                callback();
            });
        }
    },
    findScore: async function(s_id) {
        var qry = {
            where: { id: s_id },
            include: [{ model: _DB.MODELS.PERFORMANCE }]
        };
        var finalScore = 0;
        await _DB.findModel("SUPPLIER", qry, async function(results) {
            results = results.dataValues;
            var suppliers = results.performances;
            var tScr = 0;
            await suppliers.forEach(function(supp) {
                tScr += supp.score;
            });
            finalScore = tScr / suppliers.length;
            console.log(finalScore + " =====");
        });
        return finalScore;
    }

}
module.exports = _DB;

/*
const Model = sequelize.define('Model', {
  key1: {
    type: Sequelize.STRING,
    unique: true
  },
  key2: {
    type: Sequelize.STRING,
    unique: true
  }
}, {
  indexes: [
    { fields: ['key1', 'key2'], unique: true }
  ]
})

key: {
    // needs to be unique
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
}




*/