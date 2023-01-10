let activeSectionId = 'shoes'

let shoesInCart = []

const initialSection = getActiveSection()

initialSection.classList.add('active')

renderSectionContentById(activeSectionId)

// ---

const sectionWithCounter = document.querySelector('button[data-shoes-count]')

const sections = document.querySelectorAll('button.section')

addClickListeners(sections, clickHandler)

// ---

function clickHandler(event) {
	const activeSection = getActiveSection()

	activeSection.classList.remove('active')
	event.target.classList.add('active')

	activeSectionId = event.target.dataset.sectionId

	removeActiveSectionContent()

	renderSectionContentById(activeSectionId)
}

function addInCartHandler(product) {
	return () => {
		let hasProduct = false
		let index = null
		let count = 1

		for (let i = 0; i < shoesInCart.length; i++) {
			const productInCart = shoesInCart[i]

			if (product.id === productInCart.id) {
				hasProduct = true
				index = i
				count = productInCart.count
			}
		}

		if (hasProduct) {
			shoesInCart[index].count = count + 1
		} else {
			const productWithCount = product
			productWithCount.count = count
			shoesInCart.push(productWithCount)
		}

		// ---

		let fullSize = 0

		for (let i = 0; i < shoesInCart.length; i++) {
			const productInCart = shoesInCart[i]
			fullSize += productInCart.count
		}

		sectionWithCounter.dataset.shoesCount = fullSize
	}
}

function RemoveInCartHandler(productId) {
	return () => {
		const newShoesInCart = []

		for (let i = 0; i < shoesInCart.length; i++) {
			const product = shoesInCart[i]

			if (productId === product.id) {
				if (product.count > 1) {
					newShoesInCart.push({
						id: product.id,
						name: product.name,
						price: product.price,
						imgSrc: product.imgSrc,
						count: product.count - 1,
					})
				}
				updateCartItem(product.id, product.count)
			} else {
				newShoesInCart.push(product)
			}
		}

		shoesInCart = newShoesInCart

		// ---

		let fullSize = 0

		for (let i = 0; i < shoesInCart.length; i++) {
			const productInCart = shoesInCart[i]
			fullSize += productInCart.count
		}

		sectionWithCounter.dataset.shoesCount = fullSize
	}
}

function addClickListeners(elements, callback) {
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i]

		element.addEventListener('click', callback)
	}
}

function createProduct(product) {
	return {
		id: product.id,
		name: product.name ? product.name : 'Not found name',
		price: product.price ? product.price : null,
		imgSrc: product.imgSrc ? product.imgSrc : 'Not found image',
	}
}

function getActiveSection() {
	return document.querySelector(`button[data-section-id="${activeSectionId}"]`)
}

function removeActiveSectionContent() {
	const activeContent = document.querySelector(
		`[data-active-section-content="true"]`
	)

	activeContent.remove()
}

function renderSectionContentById(sectionId) {
	const sectionsContainer = document.querySelector('.container')
	let html = null

	if (sectionId === 'shoes') {
		html = renderShoes()
	} else {
		html = renderCart()
	}
	if (html !== null) {
		sectionsContainer.after(html)
	}
}

function renderShoes() {
	const div = document.createElement('div')
	div.dataset.activeSectionContent = 'true'
	div.className = 'product__contain'

	for (let i = 0; i < SHOES.length; i++) {
		const product = createProduct(SHOES[i])

		const price =
			product.price === null
				? 'Sold out'
				: `<h5 class="product__price">$ ${product.price}</h5>`

		const productBlock = document.createElement('div')
		productBlock.className = 'product__item'
		productBlock.innerHTML = `
		<img
			class="product__img" src="${product.imgSrc}" width="600px" alt=""/>
			${price}
				<h4 class="product__name">
					${product.name}
					 <div class="cart__item">
				   </div>
				</h4>
    `

		if (product.price !== null) {
			const clickHandler = addInCartHandler(product)

			const button = document.createElement('button')
			button.className = 'cart__btn'
			button.textContent = 'Add in cart'
			button.addEventListener('click', clickHandler)

			productBlock.querySelector('.cart__item').append(button)
		}

		div.append(productBlock)
	}
	return div
}

function renderCart() {
	const container = document.createElement('div')
	container.dataset.activeSectionContent = 'true'
	container.className = 'cart-items'

	for (let i = 0; i < shoesInCart.length; i++) {
		const product = shoesInCart[i]

		const cartItem = document.createElement('div')
		cartItem.dataset.elementId = product.id
		cartItem.className = 'cart-item'
		cartItem.innerHTML = `
		  <img src="${product.imgSrc}" width="400px" alt=""/>
		  <h1 class="cart-item-title">${product.name}</h1>
		  <div class="cart-item-count">${product.count}</div>
		  <div class="cart-item-price">$ ${product.price} - one pair</div>
		`

		const clickHandler = RemoveInCartHandler(product.id)

		const button = document.createElement('button')
		button.className = 'btn-remove-cart-item'
		button.textContent = 'Remove'
		button.addEventListener('click', clickHandler)

		cartItem.append(button)

		container.append(cartItem)
	}

	return container
}
function updateCartItem(id, count) {
	const cartItem = document.querySelector(`[data-element-id="${id}"]`)
	if (count > 1) {
		const countElement = cartItem.querySelector('.cart-item-count')
		countElement.textContent = `${count - 1}`
	} else {
		cartItem.remove()
	}
}
