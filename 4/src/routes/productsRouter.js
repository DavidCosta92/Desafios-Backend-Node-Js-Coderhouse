import express, { Router } from 'express';
import {randomUUID} from 'crypto';
import { Product } from '../Product.js';
import { ProductManager } from '../ProductManager.js';

export const productsRouter = Router();

productsRouter.use(express.json()); 
productsRouter.use(express.urlencoded({ extended: true })); 

const productManager = new ProductManager ("database");

productsRouter.get("/" , async (req, res , next) => {
   try {
    const products = await productManager.getProducts(req.query.limit);
    res.json(products);
    } catch (error) {
        next(error);        
    }
});

productsRouter.post('/', async (req, res , next) => {
    try {
        const id = randomUUID();
        const product = new Product({
            id : id,
            ...req.body
        }) 
        const productAdded = await productManager.addProduct(product);
        res.json(productAdded);        

        // ACA DEBERIA USAR UN MIDLEWARE PARA USAR SOCKETS DENTRO DE LA PETICION POST


    } catch (error) {
        next(error);
    }

/* Product post prueba
{
  "title" : "pan",
  "description" : "trincha",
  "code" : "pan124",
  "price" : 100,
  "stock" : 5,
  "category" : "panificados",
  "thumbnails" : [
                  "./img/panificados/pan/1.png",
                  "./img/panificados/pan/2.png",
                  "./img/panificados/pan/3.png"
                  ]
}
*/

});

productsRouter.get('/:pid', async (req, res , next)=>{
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.json(product);
    } catch (error) {
        next(error);
    }
});

productsRouter.put('/:pid', async (req, res , next)=>{
    let newProduct;
    try {
        newProduct = new Product({
            id:req.params.pid,
            ...req.body
        })
    } catch (error) {
        return next(error);
    }
    
    try {
        const productUpdated = await productManager.updateProductById(req.params.pid, newProduct);
        res.json(productUpdated);
    } catch (error) {
        next(error);
    }

});

productsRouter.delete("/:pid" , async (req, res , next) => {
    try {
        const productDeleted = await productManager.deleteById(req.params.pid);
        res.json(productDeleted);
    } catch (error) {
        next(error);        
    }
});

