const mongoose = require('mongoose');


const dbConection = async() =>{

    try {

        await mongoose.connect( process.env.MONGODB_ATLAS);
        
        console.log('Base de datos online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al levantar la base de datos')
    }


}


module.exports = {
    dbConection
}