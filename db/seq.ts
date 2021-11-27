import { Sequelize, DataTypes } from 'sequelize';

const dev = process.env.NODE_ENV !== 'production';

const sequelize = new Sequelize('epiz_27215738_click_eat_db', 'epiz_27215738', 'Rk840UXI2O7', {
    host: 'sql105.epizy.com',
    dialect: "mariadb"
});

// MODELS
export const UserDb = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    phoneNumber: {
        type: DataTypes.NUMBER
    }
}, {
    // Other model options go here
});

export const ItemsDb = sequelize.define('items', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unitPrice: {
        type: DataTypes.NUMBER
        // allowNull defaults to true
    },
    category: {
        type: DataTypes.STRING
    },
    photoURLS: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    }
});

export const CategoriesDb = sequelize.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

export const RestaurantsDb = sequelize.define('restaurants', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export const OrdersDb = sequelize.define('orders', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    invoiceNumber: {
        type: DataTypes.UUID,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.NUMBER
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    }
});
/*
* Define relations
* */
CategoriesDb.hasMany(ItemsDb, {
    foreignKey: "categoryId"
});
/*many to many relations*/
RestaurantsDb.belongsToMany(CategoriesDb, {through: 'RestaurantCategories'});
CategoriesDb.belongsToMany(RestaurantsDb, {through: 'RestaurantCategories'});

RestaurantsDb.belongsToMany(ItemsDb, {through: 'RestaurantItems'});
ItemsDb.belongsToMany(RestaurantsDb, {through: 'RestaurantItems'});

(async function () {
    try {
        await sequelize.authenticate();
        // sync tables
        await sequelize.sync({ force: dev });
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();