import fs from 'fs/promises'

class Product{
    constructor (title, description, price, thumbnail, code , stock){
        this.idInManager=1;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
    setidInManager(idInManager){
        this.idInManager = idInManager;
    }
}

class ProductManager{
    #products= [];
    path = "";

    constructor (path){
        this.path = path;
        this.saveProductsFile();
    }

    async readProductsFile(){
        const productsFileJson = await fs.readFile(this.path, "utf-8");
        this.#products = JSON.parse(productsFileJson);
    }

    async saveProductsFile(){
        const productsFileJson = JSON.stringify(this.#products, null, 2)
        await fs.writeFile(this.path, productsFileJson)
    }

    productoInvalido(product){
        let productoInvalido = "Producto con campos incompletos o erroneos";

        let stringsValidos = typeof(product.title) === "string" && typeof(product.description) === "string" && typeof(product.thumbnail) === "string" && typeof(product.code) === "string";
        let numerosValidos = typeof(product.price) === "number" && product.price > 0 && typeof(product.stock) === "number" && product.stock > 0;
        
        if(stringsValidos && numerosValidos){
            productoInvalido = "";
        }
        return productoInvalido;
    }

    async addProduct(product){
        await this.readProductsFile();
        let productInManager = "";
        let productoInvalido = this.productoInvalido(product);
        if (!productoInvalido){
            if (this.#products.length === 0){
                this.#products.push(product);
                await this.saveProductsFile();
                console.log(productInManager = "<<< Producto agregado a manager >>>");
            } else {
                for (const pr of this.#products){
                    if(pr.code === product.code) console.log(productInManager = "<<< Producto ya se encuentra en Manager >>>");
                }
                if(!productInManager){
                    product.setidInManager(this.#products.length+1);
                    this.#products.push(product);
                    await this.saveProductsFile();
                    console.log(productInManager = "<<< Producto agregado a manager >>>");
                }
            }
        }
        console.log(productoInvalido);
        return productInManager;
    }

    async getProducts(){
        await this.readProductsFile();
        return this.#products;
    }

    async getProductById(id){
        try{
            await this.readProductsFile();
            const productSearch = this.#products.find(product => product.idInManager === id);
            return productSearch
        }
        catch (error){
            console.log(error)
        }
    }

    isProductComplete(product){
        let productComplete = false;
        if(!product.title && !product.description && !product.price && !product.thumbnail && !product.code && !product.stock){
            productComplete = true;
        }
        return productComplete;
    }

    async getIndexByProductId(id){
        await this.getProductById(id); // valida la existencia del ID, propaga error
        let indexInManager=0;
        for (let index = 0; index < this.#products.length; index++) {
            if(this.#products[index].idInManager === id) indexInManager = index+1;
        }
        return indexInManager-1;
    }

    async updateProduct(id, product){    
        await this.readProductsFile();
        let indexToUpdate = await this.getIndexByProductId(id);   

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
    }

    async deleteProduct(id){
        await this.readProductsFile();  
        let indexToDelete = await this.getIndexByProductId(id);              
        this.#products.splice(indexToDelete, 1);
        this.saveProductsFile();
    }

}


//// PRUEBAS /////
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