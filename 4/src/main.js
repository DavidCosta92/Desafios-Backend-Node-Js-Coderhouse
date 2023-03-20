import express from 'express'
import { PORT } from './PORT.js';
import { productsRouter } from './routes/productsRouter.js';
import { cartsRouter } from './routes/cartsRouter.js';
import { ProductManager } from './ProductManager.js';
import { engine } from 'express-handlebars'
import {Server as IOServer} from 'socket.io'
import {randomUUID} from 'crypto';
import { Product } from './Product.js';


const app = express();
app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);

// CONFIG INICIAL HANDLEBARS
app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

// SETEAR CARPETA PUBLICA PARA LEVANTARLA DESDE FRONT
app.use(express.static('./public'))

const httpServer = app.listen(PORT, () => console.log("Servidor activo")) // INSTANCIO VARIABLE PARA USAR SERVIDOR CON IO
const io = new IOServer(httpServer) // PASO SERVIDOR CREADO PARA QUE SEA BIDIRECCIONAL

const productManager2 = new ProductManager ("database");
io.on('connection', async clientSocket=>{ 
    //ACTUALIZAR AL CONECTARSE
    console.log("nuevo cliente conectado", clientSocket.id)
    io.emit('actualizarRender', await productManager2.getProducts())
    //ACTUALIZAR AL HABER CAMBIOS
    clientSocket.on('actualizar', async ()=>{  
        io.emit('actualizarRender', await productManager2.getProducts())
   })

   clientSocket.on('crearProducto', async productoNuevo =>{    
        try {
            const id = randomUUID();
            const product = new Product({
                id : id,
                ...productoNuevo
            }) 
            const productAdded = await productManager2.addProduct(product);
            io.emit('actualizarRender', await productManager2.getProducts())

        } catch (error) {
            console.log("ERROR => ", error.message)
        }
   })

   clientSocket.on('eliminarProducto', async id=>{
        await productManager2.deleteById(id);
        io.emit('actualizarRender', await productManager2.getProducts())
   })
})


app.get("/realtimeproducts" , async (req, res, next)=>{    
    try {
        const products = await productManager2.getProducts(req.query.limit);

        res.render('realtimeproducts', {
            hayProductos : products.length >0,
            productos : products,
            pageTitle: 'Productos REAL TIME'
        })
    } catch (error) {
        next(error);        
    }

})

app.get("/" , async (req, res, next)=>{ 
    try {
       const products = await productManager2.getProducts(req.query.limit);

        res.render('home', {
            hayProductos : products.length >0,
            productos : products,
            pageTitle: 'Productos ESTATICOS'
        })
       console.log("products==>",products)
    } catch (error) {
        next(error);        
    }
})


app.use((error, req, res , next)=>{

    switch (error.message){
        case "ID no encontrado" : 
            res.status(404).json({menssage: error.message});
            break;
        case "Producto no encontrado" : 
            res.status(404).json({menssage: error.message});
            break;
        case "Cantidad incorrecta, la cantidad debe ser un numero, entero y mayor a 0" : 
            res.status(400).json({menssage: error.message});
            break;
        case "Producto con campos incompletos o erroneos" : 
            res.status(400).json({menssage: error.message});
            break;
        case "Producto ya se encuentra en base de datos" : 
            res.status(400).json({menssage: error.message});
            break;
        case "Limite incorrecto, el limite debe ser un numero, entero y mayor a 0" : 
            res.status(404).json({menssage: error.message});
            break;
        default : 
            res.status(500).json({menssage: error.message});
    }
})

