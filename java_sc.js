// Agus_Cardetail 
let carrito = JSON.parse(localStorage.getItem("carrito_agus")) || [];

let productos = JSON.parse(localStorage.getItem("productos_agus")) || [
    {id:1 , nombre : "shampoo", precio: 20000, stock: 5, img: "static/img/shampoo.png",},
    {id:2 , nombre : "cera", precio: 10000, stock: 10, img: "static/img/cera.png",},
    {id:3 , nombre : "acondionador_ext", precio: 25000, stock: 1, img: "static/img/acondionador_ext.png"},
    {id:4 , nombre : "acondionador_int", precio: 50000, stock: 50, img: "static/img/acondionador_int.png"},
    {id:5 , nombre : "cepillo", precio: 50000, stock: 50, img: "static/img/cepillo.png"},
    {id:6 , nombre : "pulidora", precio: 50000, stock: 50, img: "static/img/pulidora.png"},
    {id:7 , nombre : "sellador", precio: 50000, stock: 50, img: "static/img/sellador.png"}
];

const guardarLocal = () => {
    localStorage.setItem("carrito_agus", JSON.stringify(carrito));
    localStorage.setItem("productos_agus", JSON.stringify(productos));
};

const cargar_productos = (productosAMostrar = productos) => {
    let contenedor = document.getElementById("cont_productos");
    contenedor.innerHTML = ""; 

    productosAMostrar.forEach((producto) => { 
        let div = document.createElement("div"); 
        div.className = "card-producto";  
        let textoStock;
        if (producto.stock === 1) {
            textoStock = "¡ÚLTIMA UNIDAD!";
        } else if (producto.stock === 0) {
            textoStock = "AGOTADO";
        } else {
            textoStock = `Stock disponible: ${producto.stock}`;
        }
        
        div.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}" class="img-producto">
            <h1>${producto.nombre}</h1>
            <h2>$${producto.precio}</h2>
            <p>${textoStock}</p>
            <button class='btn_agregar' data-id="${producto.id}">Agregar al carrito</button>
        `; 
        contenedor.appendChild(div); 
    });

    let but_Agr = document.querySelectorAll(".btn_agregar"); 
    but_Agr.forEach((x) => x.addEventListener("click", (i) => { 
        let prod_enc = productos.find((p) => p.id == i.target.dataset.id); 
        
        if (prod_enc.stock > 0) {
            let existe = carrito.find((p) => p.id == prod_enc.id);

            if (existe) {
                existe.cantidad++; 
                
            } else { 
                prod_enc.cantidad = 1; 
                carrito.push(prod_enc); 
            }

            prod_enc.stock--; 
            
            Toastify({
                text: `¡${prod_enc.nombre.toUpperCase()} AGREGADO!`,
                duration: 2000,
                gravity: "top", 
                position: "right",
                className: "toast-personalizado", 
                style: {
                    background: "linear-gradient(to right, #004289, #0072ff)",
                    borderRadius: "10px",
                }
            }).showToast();
            
            
            guardarLocal();
            cargar_productos(); 
            total_Ul();

            if (document.getElementById("ventana_carrito").style.display === "block") {
                carrito_loading(); 
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "¡Sin Stock!",
                text: "Lo sentimos, no quedan más unidades disponibles.",
                confirmButtonColor: "#004289" 
            });
        }
    }))
};



const total_Ul = () => {
    const totalUnidades = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    document.getElementById("contador-carrito").innerText = totalUnidades; 
};

const eliminarProducto = (id) => {
    let producto = carrito.find((p) => p.id === id);
    if (producto) {
        
        let prodOriginal = productos.find((p) => p.id === id);
        prodOriginal.stock++; 
        Toastify({
                    text: `¡${producto.nombre.toUpperCase()} ELIMINADO`,
                    duration: 2000,
                    gravity: "top", 
                    position: "right",
                    className: "toast-personalizado", 
                    style: {
                        background: "linear-gradient(to right, #7c019b, #ff0202)", 
                        borderRadius: "10px",
                    }
                }).showToast();
            
        
        
        if (producto.cantidad > 1) {
            producto.cantidad--; 
        } else {
            carrito = carrito.filter((p) => p.id !== id);
        }
    }
    guardarLocal(); 
    total_Ul();
    cargar_productos();
    carrito_loading(); 
};

const limpiarCarrito = () => {
    Swal.fire({
        title: "¿Vaciar el carrito?",
        text: "Esta acción eliminara todos los productos del carrito.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#004289", 
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, vaciarlo",
        cancelButtonText: "Cancelar"
        }).then((result) => {
        if (result.isConfirmed) {
            carrito.forEach(p => {
                let prodOriginal = productos.find(po => po.id === p.id);
                prodOriginal.stock += p.cantidad;
            });
            
            carrito = []; 
            localStorage.removeItem("carrito_agus"); 
            total_Ul();
            cargar_productos();
            carrito_loading();
            Swal.fire({title: "¡Vaciado!",
                text: "El carrito se limpió correctamente.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false});
        } 
    });
    
};

const carrito_loading = () => {
    let cont_ventana = document.getElementById("ventana_carrito");
    let lista_carrito = document.getElementById("lista-carrito");
    
    lista_carrito.innerHTML = ""; 

    let cabecera = document.createElement("div");
    cabecera.innerHTML = `
            <p><strong>PRODUCTO | CANT | SUBTOTAL</strong> <button id="btn-limpiar">LIMPIAR CARRITO</button></p>   
    `;
    lista_carrito.appendChild(cabecera);

    carrito.forEach((p) => {
        let div_item = document.createElement("div");
        div_item.className = "lista_carrito";
        div_item.innerHTML = `
            <p>${p.nombre} | ${p.cantidad} | $${p.precio * p.cantidad} <button class="btn-quitar" data-id="${p.id}"> X </button></p>
        `;
        lista_carrito.appendChild(div_item);
    });

    document.getElementById("btn-limpiar").onclick = limpiarCarrito;
    document.querySelectorAll(".btn-quitar").forEach(btn => {
        btn.onclick = (e) => eliminarProducto(parseInt(e.target.dataset.id));
    });

    const totalCompra = carrito.reduce((acu, p) => acu + (p.precio * p.cantidad), 0); 
    let div_total = document.createElement("div");
    div_total.innerHTML = `<hr><h3>Total Final: $${totalCompra}</h3>`;
    lista_carrito.appendChild(div_total);

    cont_ventana.style.display = "block";

};


cargar_productos();
total_Ul();

document.getElementById("icon-carrito").addEventListener("click", (e) => {

    const ventanaCarrito = document.getElementById("ventana_carrito");
    
    if (ventanaCarrito.style.display === "none" || ventanaCarrito.style.display === "") {
        carrito_loading(); // 
    } else {
        ventanaCarrito.style.display = "none"; 
    }
});
 


document.getElementById("btn-cerrar").addEventListener("click", () => {
    document.getElementById("ventana_carrito").style.display = "none";
});

const actualizarInterfaz = () => {
    total_Ul(); 
    cargar_productos(); 
    
    
    if (document.getElementById("ventana_carrito").style.display === "block") {
        carrito_loading(); 
    }
};


document.getElementById("btn-comprar").addEventListener("click", () => {
    if (carrito.length > 0) {
     
        Swal.fire({
            title: 'Procesando tu compra',
            text: 'Estamos verificando el stock...',
            allowOutsideClick: false,
            showConfirmButton: false, 
            willOpen: () => {
                Swal.showLoading(); 
            }
        });

        try {
    
            setTimeout(() => {
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Compra registrada!',
                    text: 'Gracias por confiar en Agus_Cardetail',
                    timer: 2000,
                    showConfirmButton: false
                });

              
                carrito = [];
                localStorage.removeItem("carrito_agus");
                actualizarInterfaz();
                document.getElementById("ventana_carrito").style.display = "none";
            }, 2000);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el sistema',
                text: 'No pudimos procesar la compra.',
            });
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Agregá algunos productos primero.',
        });
    }
});
document.getElementById("input-busqueda").addEventListener("input", (e) => {
    const textoBusqueda = e.target.value.toLowerCase();
    
    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(textoBusqueda)
    );

    cargar_productos(productosFiltrados);
});


cargar_productos();
total_Ul();