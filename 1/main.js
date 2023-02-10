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

    productoInvalido(product){
        let productoInvalido = "Producto con campos incompletos o erroneos";

        let stringsValidos = typeof(product.title) === "string" && typeof(product.description) === "string" && typeof(product.thumbnail) === "string";
        let numerosValidos = typeof(product.price) === "number" && typeof(product.code) === "number" && typeof(product.stock) === "number";
        let cantidadValida = product.price > 0 && product.code > 0 && product.stock > 0;
        
        if(stringsValidos && numerosValidos && cantidadValida){
            productoInvalido = "";
        }
        return productoInvalido;
    }

    addProduct(product){
        let productInManager = "";
        if (!this.productoInvalido(product)){
            if (this.#products.length === 0){
                this.#products.push(product)
                console.log(productInManager = "Producto agregado a manager");
            } else {
                for (const pr of this.#products){
                    if(pr.code === product.code){
                        console.log(productInManager = "Producto ya se encuentra en Manager");
                    }
                }
                if(!productInManager){
                    product.setidInManager(this.#products.length+1);
                    this.#products.push(product);
                    console.log(productInManager = "Producto agregado a manager");
                }
            }
        }
        console.log(this.productoInvalido(product));
    return productInManager;
    }

    getProducts(){
        return this.#products;
    }

    getProductById(id){
        const productSearch = this.#products.find(product => product.idInManager === id);
        return productSearch || "Not found";
    }

}

const product1 = new Product("manzana", "grande", 100, "./assets/product/manzana.png", 123456 , 10);
const product2 = new Product("naranja", "chica", 80, "./assets/product/naranja.png", 234567 , 2);
const product3 = new Product("durazno", "pelon", 50, "./assets/product/durazno.png", 345678 , 3);
const product4 = new Product("pera", "madura", 120, "./assets/product/pera.png", 456789 , 2);
const product5 = new Product("perassss", 120, "./assets/product/pera.png", 2);

const productManager1 = new ProductManager();
productManager1.addProduct(product1);
productManager1.addProduct(product2);
productManager1.addProduct(product3);
productManager1.addProduct(product4);

console.log("-------- Producto con campos incompletos => Resultado esperado: Producto con campos incompletos o erroneos -----------")
productManager1.addProduct(product5);

console.log("-------- Productos -----------")
console.table(productManager1.getProducts());

console.log("-------- Producto by ID (2) -----------")
console.table(productManager1.getProductById(2)); 

console.log("-------- Producto by ID (10) => Resultado esperado: Not found -----------")
console.table(productManager1.getProductById(10));

console.log("-------- Agregar producto con codigo duplicado => Resultado esperado: Producto ya se encuentra en Manager -----------")
productManager1.addProduct(product1); 


