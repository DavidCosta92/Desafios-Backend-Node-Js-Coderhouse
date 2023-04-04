// @ts-nocheck

const serverSocket = io('http://localhost:8080');


const plantilla = `
{{#if hayProductos }}
<table class="table table-dark table-striped">
  <thead>
    <tr>
      <th scope="col">Titulo</th>
      <th scope="col">Precio</th>
      <th scope="col">Descripcion</th>
      <th scope="col">Id</th>
      <th scope="col">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {{#each productos}}
        <tr>    
        <td>{{this.title}}</td>
        <td>{{this.price}}</td>
        <td>{{this.description}}</td>  
        <td>{{this.id}}</td>
        <td>
            <button onClick=eliminarProducto("{{this.id}}") id={{this.id}} type="button" class="btn btn-danger">
                Eliminar
            </button>
        </td>
        </tr>
    {{/each}}
  </tbody>
</table>

{{else}}
<p>NO HAY PRODUCTOS AUN...</p>
{{/if}}
`



const armarHtmlDinamico = Handlebars.compile(plantilla) 

function obtenerDatosForm(){
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const code = document.getElementById('code').value
    const price = document.getElementById('price').value
    const category = document.getElementById('category').value
    const stock = document.getElementById('stock').value
    const thumbnails = document.getElementById('thumbnails').value
    const productoNuevo = {title : title , description : description , code : code , price : price , category : category , stock : stock , thumbnails : thumbnails}
    crearProducto(productoNuevo)
}
function crearProducto(productoNuevo){    
  //serverSocket.emit('crearProducto', productoNuevo)

  // USANDO POST =>
  // revisar como enviar desde form con methodo post al endpoint..



}

function eliminarProducto(id){
    serverSocket.emit('eliminarProducto', id)
}

serverSocket.on('actualizarRender', productos=>{
    const div = document.getElementById("productosRealTime")
    if(div) div.innerHTML = armarHtmlDinamico({productos, hayProductos: productos.length > 0 })
} )