  const btnCart: HTMLElement | null = document.querySelector('#btn-cart');
  const containerCartProducts: HTMLElement | null = document.querySelector('#container-cart-products');
  const cartEmpty: HTMLElement | null = document.querySelector('.cart-empty');
  const rowProduct: HTMLElement | null = document.querySelector('.row-product');
  const cartTotal: HTMLElement | null = document.querySelector('.cart-total');
  const valorTotal: HTMLElement | null = document.querySelector('.total-pagar');
  const countProducts: HTMLElement | null = document.querySelector('#contador-productos');
  const btnPay: HTMLElement | null = document.querySelector('#btn-pay');
  // Utilizamos un Map para almacenar los productos, usando su nombre como clave
  let allProducts: Map<string, { name: string, price: number, quantity: number }> = new Map();

// Evento para mostrar/ocultar el carrito
btnCart?.addEventListener('click', () => {
  if (containerCartProducts?.classList.contains('hidden')) {
    containerCartProducts?.classList.remove('hidden');
  } else {
    containerCartProducts?.classList.add('hidden');
  }
});

// Función para actualizar los productos del carrito
const renderCartProducts = (products: Map<string, { name: string, price: number, quantity: number }>) => {
  rowProduct!.innerHTML = '';
  
  if (products.size === 0) {
    cartEmpty?.classList.remove('hidden');
    cartTotal?.classList.add('hidden');
  } else {
    cartEmpty?.classList.add('hidden');
    cartTotal?.classList.remove('hidden');
    
    let total = 0;

    products.forEach((product) => {
      const quantity = product.quantity;
      const totalPrice = product.price * quantity;
      total += totalPrice;
      
      const productHtml = `
        <div class="flex items-center justify-between py-2 border-b border-gray-200">
          <div class="flex items-center space-x-4">
            <span class="text-gray-700 font-medium">${product.name} x${quantity}</span>
          </div>
          <div class="text-gray-700 font-medium">
            $${totalPrice.toFixed(3)}
          </div>
          <span class="btn-remove w-50 h-300 inline-flex items-center px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none" data-name="${product.name}">
            <strong>X</strong>
          </span>
        </div>
      `;
      
      rowProduct!.innerHTML += productHtml;
    });
    
    valorTotal!.innerHTML = `<strong>$${total.toFixed(3)}</strong>`;
  }

  countProducts!.innerHTML = `${Array.from(products.values()).reduce((acc, product) => acc + product.quantity, 0)}`;
};

// Función para eliminar un producto del carrito
const removeFromCart = (productName: string) => {
  const product = allProducts.get(productName);
  
  if (product) {
    // Si el producto tiene más de una unidad, reducimos su cantidad
    if (product.quantity > 1) {
      product.quantity--;
    } else {
      // Si la cantidad es 1, eliminamos el producto del carrito
      allProducts.delete(productName);
    }
    
    // Actualizamos solo el producto eliminado en el DOM
    renderCartProducts(allProducts);
  }
};

// Evento para eliminar un producto del carrito
rowProduct?.addEventListener('click', (e: any) => {
  if (e.target.classList.contains('btn-remove')) {
    const productName = e.target.dataset.name;
    if (productName) {
      removeFromCart(productName);
    }
  }
});

// Añadir eventos a los botones de añadir al carrito
const productsList = document.querySelector('.container-items');
if (productsList) {
  const btnsAddCart: NodeListOf<HTMLElement> = productsList.querySelectorAll('.btn-add-cart');
  btnsAddCart.forEach((btn: HTMLElement) => {
    btn.addEventListener('click', (e: Event) => {
      const productElement = (e.target as HTMLElement).parentElement!;
      const productName = productElement.querySelector('h2')?.textContent || '';
      const productPrice = parseFloat(productElement.querySelector('p')?.textContent!.replace('$', '') || '0');
      
      if (productName) {
        // Si el producto ya existe en el carrito, aumentamos su cantidad
        if (allProducts.has(productName)) {
          const product = allProducts.get(productName);
          if (product) {
            product.quantity++;
          }
        } else {
          // Si no existe, lo agregamos al carrito con cantidad 1
          allProducts.set(productName, { name: productName, price: productPrice, quantity: 1 });
        }
      }
      // Volver a renderizar los productos del carrito
      renderCartProducts(allProducts);
    });
  });
}

// Evento para pagar
btnPay?.addEventListener('click', () => {
  alert('¡Pago exitoso!');
  allProducts.clear();
  renderCartProducts(allProducts);
  containerCartProducts?.classList.add('hidden');
});
