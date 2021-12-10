const { Router } = require('express');
const router = new Router();
const fs = require('fs')
const crypto = require('crypto')
const mailer = require('nodemailer')

router.post('/login', async (req, res) => {
    const {usuario, pass} = req.body
    const u = {...req.body}
    // console.log(req.body)
    await fs.readFile('usuarios.json', (err, data) => {
        if(err) return console.log(err)

        let usuarios = data.toString()
        usuarios = JSON.parse(usuarios)
        const lu = usuarios.filter((usuario) => {
            return (usuario.usuario === u.usuario) && (usuario.pass === u.hash)
        })
    
        if(lu[0]){
            console.log(lu[0])
            res.status(200).json(lu[0])
        } else {
            console.log('no encontrado')
            res.status(500).json({error: 'Hubo un error'})
        }
    })
    
});  

router.post('/restablecer', (req, res) => {
    const usuario = {...req.body}
    console.log(usuario)
    const transporter = mailer.createTransport({
        service: 'Gmail',
        // secure: false,
        auth: {
            user: 'equipoc3cm17@gmail.com',
            pass: 'qoojybvskqdravdo'
        }
    })
    const opciones = {
        from: '<equipoc3cm17@gmail.com>',
        to: usuario.correo,
        subject: 'Restablecimiento contraseña NewMarket',
        html: `
            <h2>En caso de reestablecer tu contrseña, dar clic en el siguiente enleace:</h2>
            <a href='http://localhost:3000/${usuario.correo}'><h2>Restablece tu contraseña aqui</h2></a>
            <br />
            <h4>En caso negativo, hacer caso omiso de este correo.</h4>
        `
    }

    transporter.sendMail(opciones, (err, info) => {
        if(err) {
            console.log(err)
            res.status(500).send(err.message)
        } else {
            console.log('Correo enviado: ' + info.response)
            res.status(200).json()
        }
    })
});

router.post('/recuperar', async (req, res) => {
    const u = {...req.body}
    await fs.readFile('usuarios.json', (err, data) => {
        if(err) return console.log(err)
        
        let usuarios = data.toString()
        usuarios = JSON.parse(usuarios)
        
        console.log(u)

        usuarios.map((usuario) => {
            if(usuario.email === u.email){
                usuario.pass = crypto.createHash('sha1').update(u.nueva).digest('hex')
            }
        })

        const str = JSON.stringify(usuarios)
        fs.writeFile('usuarios.json', str, (err) => {
            if(err) return console.log(err)
            console.log('Usuario registrado')
        })
        console.log(usuarios)
        res.status(200).json()
    })

})

router.post('/registrar', async (req, res) => {
    const {usuario, pass, email} = req.body
    const nuevoU = {...req.body}

    await fs.readFile('usuarios.json', (err, data) => {
        if(err) return console.log(err)
        
        let usuarios = data.toString()
        usuarios = JSON.parse(usuarios)

        const existeU = usuarios.filter((eu) => {
            return (eu.usuario === nuevoU.usuario)
        })

        if(!existeU[0]){
            nuevoU.pass = crypto.createHash('sha1').update(pass).digest('hex')

            usuarios.push(nuevoU)

            const str = JSON.stringify(usuarios)
            fs.writeFile('usuarios.json', str, (err) => {
                if(err) return console.log(err)
                console.log('Usuario registrado')
            })

            console.log(nuevoU)
            console.log(usuarios)
            console.log(nuevoU.email)

            // res.status(200).json()
        }
    })
    const transporter = mailer.createTransport({
        service: 'Gmail',
        // secure: false,
        auth: {
            user: 'equipoc3cm17@gmail.com',
            pass: 'qoojybvskqdravdo'
        }
    })
    const opciones = {
        from: '<equipoc3cm17@gmail.com>',
        to: nuevoU.email,
        subject: 'Usuario Nuevo',
        html: `
            <h2>Tu cuenta fue registrada con exito</h2>
            <h2>Ahora puedes inicar sesion dando <a href='http://localhost:3000'>clic aqui</a></h2>
        `
    }

    transporter.sendMail(opciones, (err, info) => {
        if(err) {
            console.log(err)
            res.status(500).send(err.message)
        } else {
            console.log('Correo enviado: ' + info.response)
            res.status(200).json()
        }
    })
    // res.status(200).json()
    
});

module.exports = router;