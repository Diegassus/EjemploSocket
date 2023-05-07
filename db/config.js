const mongoose = require('mongoose')



const dbconnection = async ()=>{
    try{
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB_CNN, () => {
          console.log('Conectado a la base de datos');
        });    
    }catch(e){
        console.log(e);
    }
}


module.exports={
    dbconnection
}