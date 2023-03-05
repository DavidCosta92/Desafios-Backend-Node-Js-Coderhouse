// @ts-nocheck
import express from "express";
import { Product } from './Product.js';
import { ProductManager } from "./ProductManager.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productManager = new ProductManager ("database/ProductsFile-test.txt");
// CARGA INICIAL DEL ARCHIVO
const product1 = new Product("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123" , 25);
const product2 = new Product("naranja", "chica", 80, "./assets/product/naranja.png", "234567" , 2);
const product3 = new Product("manzana", "grande", 80, "./assets/product/manzana.png", "2567" , 2);
const product4 = new Product("peras", "grande", 120, "./assets/product/pera.png", "25267", 2);

await productManager.addProduct(product1);
await productManager.addProduct(product2);
await productManager.addProduct(product3);
await productManager.addProduct(product4);
/////////////////////////////////////////////////

app.get("/products", async (req, res)=>{
    /*

    Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados.
    (Si se recibe un límite, sólo devolver el número de productos solicitados)
    Si no se recibe query de límite, se devolverán todos los productos

    */
    try {
        const products = await productManager.getProducts(req.query.limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
app.get('/products/:pid', async (req, res)=>{
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.json(product);
    } catch (error) {
        res.status(404).json({menssage: error.message})
    }
})

/*

PENDIENTE

app.get('/products/:pid', async (req, res)=>{
    try {
       // const persona = await personasManager.buscarById(req.params.id)
       // res.json(persona)
    } catch (error) {
        res.status(404).json({menssage: error.message})
    }
})

*/

app.listen(9090,()=> console.log("Servidor listo"))

