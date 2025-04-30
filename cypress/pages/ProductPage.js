class ProductPage {
    elements = {
        productLink: (productName) => cy.get('#Catalog').contains('a', productName),
        addToCartButton: () => cy.get('a[href*="addItemToCart"]'),
        cartQuantity: () => cy.get('input[name*="EST-"]'),
        cartItem: () => cy.get('#Cart').contains('tr', 'Angelfish'),
        proceedToCheckout: () => cy.get('a[href*="newOrderForm"]')
    }

    selectProduct(productName) {
        cy.wait(2000)
        this.elements.productLink(productName).should('be.visible').click()
        cy.wait(2000)
    }

    addToCart(quantity = 1) {
        cy.wait(2000)
        this.elements.addToCartButton().first().should('be.visible').click()
        cy.wait(2000)
        if (quantity > 1) {
            this.elements.cartQuantity().should('be.visible').clear().type(quantity)
            cy.contains('Update Cart').click()
            cy.wait(2000)
        }
    }

    validateCartItem(productName, quantity) {
        cy.wait(2000)
        this.elements.cartItem().should('be.visible')
        if (quantity > 1) {
            this.elements.cartQuantity().should('have.value', quantity.toString())
        }
    }

    proceedToCheckout() {
        this.elements.proceedToCheckout().should('be.visible').click()
        cy.wait(2000)
    }
}

export default new ProductPage() 