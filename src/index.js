const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.set('port', process.env.PORT || 4000)

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
app.use(cors())

app.use(require('./routes'));
app.use('/api/usuarios', require('./routes/usuarios'));

app.listen(app.get('port'), ()=>{
    console.log(`Servidor iniciado en el puerto ${app.get('port')}`)
} )
