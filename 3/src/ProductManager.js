import fs from 'fs/promises'
import {randomUUID} from 'crypto';

export class ProductManager{
    idManager = randomUUID();
    #products = [];
    path = "";

    constructor (path){
        this.path = path;
        this.saveProductsFile();
    }

    async readProductsFile(){
        try {
            const productsFileJson = await fs.readFile(this.path, "utf-8");
            this.#products = JSON.parse(productsFileJson);            
        } catch (error) {
            throw new Error (error.message);            
        }
    }

    async saveProductsFile(){
        try {
            const productsFileJson = JSON.stringify(this.#products, null, 2);
            await fs.writeFile(this.path, productsFileJson);
        } catch (error) {
            throw new Error (error.message);  
        }
    }

    productoValido(product){
        let stringsValidos = typeof(product.title) === "string" && typeof(product.description) === "string" && typeof(product.thumbnail) === "string" && typeof(product.code) === "string";
        let numerosValidos = typeof(product.price) === "number" && product.price > 0 && typeof(product.stock) === "number" && product.stock > 0;
        if(!stringsValidos || !numerosValidos) throw new Error ("Producto con campos incompletos o erroneos");
        return true;
    }

    async addProduct(product){
        await this.readProductsFile();
        let productInManager = "";
        if (this.productoValido(product)){
            if (this.#products.length === 0){
                this.#products.push(product);
                await this.saveProductsFile();
                console.log(productInManager = "<<< Producto agregado a manager >>>");
                return product;
            } else {
                for (const pr of this.#products){
                    if(pr.code === product.code) throw new Error ("Producto ya se encuentra en manager")
                }
                if(!productInManager){
                    this.#products.push(product);
                    await this.saveProductsFile();
                    console.log(productInManager = "<<< Producto agregado a manager >>>");
                    return product;
                }
            }
        }
        return product;
    }

    async getProducts(limit){ 
        await this.readProductsFile();
        if(limit === undefined || limit === "") return this.#products; 
        const limite = Number(limit);
        if( Number.isNaN(limite) || !Number.isInteger(limite) || limit<1 ) throw new Error ("Limite incorrecto, el limite debe ser un numero, entero y mayor a 0");
        return this.#products.slice(0,limit);        
    }

    async getProductById(idProduct){
        await this.readProductsFile();
        const productSearch = this.#products.find(product => product.idProduct === idProduct);            
        if(productSearch === undefined) throw new Error("ID no encontrado");              
        return productSearch;
    }

    isProductComplete(product){
        let productComplete = false;
        if(!product.title && !product.description && !product.price && !product.thumbnail && !product.code && !product.stock){
            productComplete = true;
        }
        return productComplete;
    }

    async getIndexByProductId(idProduct){
        await this.getProductById(idProduct); // valida la existencia del ID, propaga error
        let indexInManager=0;
        for (let index = 0; index < this.#products.length; index++) {
            if(this.#products[index].idProduct === idProduct) indexInManager = index+1;
        }
        return indexInManager-1;
    }

    async updateProduct(idProduct, product){    
        try {
            await this.readProductsFile();
            let indexToUpdate = await this.getIndexByProductId(idProduct);   
    
            if(this.isProductComplete(product)){
                this.#products.splice(indexToUpdate, 1, product);
            } else {
                let productUpdated = this.#products[indexToUpdate];
                if(product.title) productUpdated.title=product.title; 
                if(product.description) productUpdated.description=product.description; 
                if(product.price) productUpdated.price=product.price; 
                if(product.thumbnail) productUpdated.thumbnail=product.thumbnail; 
                if(product.code) productUpdated.code=product.code; 
                if(product.stock) productUpdated.stock=product.stock; 
            }
            this.saveProductsFile();            
        } catch (error) {
            throw new Error (error.message);            
        }
    }

    async deleteProductById(idProduct){
        try {
            await this.readProductsFile();  
            let indexToDelete = await this.getIndexByProductId(idProduct);              
            this.#products.splice(indexToDelete, 1);
            this.saveProductsFile();
        } catch (error) {
            throw new Error (error.message);            
        }
    }

}


//// PRUEBAS /////
/*
const productManager = new ProductManager("./ProductsFile-test.txt");
console.log("-------- Mostrar productos dentro de Product manager=> Resultado esperado: [] -----------")
console.log(await productManager.getProducts());

const product1 = new Product("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123" , 25);
const product2 = new Product("naranja", "chica", 80, "./assets/product/naranja.png", "234567" , 2);
const product3 = new Product("manzana", "grande", 80, "./assets/product/manzana.png", "2567" , 2);
const product5 = new Product("peras", 120, "./assets/product/pera.png", 2);



console.log("-------- Agregado de productos y mostrados por consola -----------")
await productManager.addProduct(product1);
await productManager.addProduct(product2);

console.log("-------- Producto con campos incompletos => Resultado esperado: Producto con campos incompletos o erroneos -----------")
await productManager.addProduct(product5);

console.log("-------- Productos -----------")
console.table(await productManager.getProducts());

console.log("-------- Producto by ID (2) -----------")
console.table(await productManager.getProductById(2)); 

console.log("-------- Producto by ID (10) => Resultado esperado: Not found -----------")
console.table(await productManager.getProductById(10));

console.log("-------- Agregar producto con codigo duplicado => Resultado esperado: Producto ya se encuentra en Manager -----------")
await productManager.addProduct(product1); 

console.log("-------- Eliminar producto -----------")
productManager.deleteProduct(2);

console.log("-------- UPDATE producto con todos los campos ID 1-----------")
console.log("ANTES de actualizar el producto..")
console.table(await productManager.getProductById(1));
const productToUpdate = new Product("Nuevo nombre de producto", "Me actualizaron", 1, "Me actualizaron",  "Me actualizaron" , 1);
await productManager.updateProduct(1,productToUpdate);
console.log("DESPUES de actualizar el producto..")
console.table(await productManager.getProductById(1));

console.log("-------- UPDATE producto con algunos de los campos ID 2-----------")
console.log("ANTES de actualizar el producto..")
console.table(await productManager.getProductById(2));
const productToUpdatePARCIAL = { title: '..cambiando el nombre al producto..', stock: 99999 }
await productManager.updateProduct(2,productToUpdatePARCIAL);
console.log("DESPUES de actualizar el producto..")
console.table(await productManager.getProductById(2));

*/