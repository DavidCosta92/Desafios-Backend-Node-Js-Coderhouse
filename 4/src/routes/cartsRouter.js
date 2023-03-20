import express, { Router } from 'express';
import {randomUUID} from 'crypto';
import { CartManager } from '../CartManager.js';

export const cartsRouter = Router();

cartsRouter.use(express.json()); 
cartsRouter.use(express.urlencoded({ extended: true })); 

const cartManager = new CartManager ("database"); 

cartsRouter.post("/", async (req, res , next) => {
    try {
        const idCart = randomUUID();
        const newCart = await cartManager.createCart(idCart);
        res.json(newCart);
    } catch (error) {
        next(error);
    }
})

cartsRouter.get("/:cid", async (req, res , next) => { 
    try {
        const productsInCart = await cartManager.getProductsByCartId(req.params.cid);
        res.json(productsInCart);
    } catch (error) {
        next(error);
    }
})

cartsRouter.post("/:cid/product/:pid", async (req, res , next) => {    
    try {
        const productAdded = await cartManager.addProductToCart(req.params.cid , req.params.pid, req.query.quantity);
        res.json(productAdded);
    } catch (error) {
        next(error);
    }
})