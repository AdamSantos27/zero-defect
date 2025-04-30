class ProductPage {
    elements = {
        addToCartButton: () => cy.get('a[href*="addItemToCart"]').first(),
        quantityInput: () => cy.get('input[name*="EST-"]'),
        updateCartButton: () => cy.get('input[type="submit"][value="Update Cart"]'),
        removeFromCartButton: () => cy.get('a[href*="removeItemFromCart"]').first(),
        cartTable: () => cy.get('#Cart'),
        subTotalRow: () => cy.contains('tr', 'Sub Total:'),
        productRow: (productName) => cy.contains('tr', productName)
    }

    addToCart() {
        this.elements.addToCartButton().click()
        cy.wait(2000)
    }

    updateQuantity(quantity) {
        this.elements.quantityInput().first().clear().type(quantity)
        this.elements.updateCartButton().click()
        cy.wait(2000)
    }

    removeFromCart() {
        this.elements.removeFromCartButton().click()
        cy.wait(2000)
    }

    parsePrice(text) {
        return parseFloat(text.replace('$', '').trim())
    }

    validateProductInCart(productName, expectedQuantity) {
        // Verificar se o produto está visível
        this.elements.productRow(productName).should('be.visible')
        
        // Verificar a quantidade
        this.elements.productRow(productName).within(() => {
            cy.get('input[name*="EST-"]').should('have.value', expectedQuantity.toString())
        })
        
        // Verificar se o subtotal está correto
        this.elements.productRow(productName).within(() => {
            cy.get('td').eq(5).invoke('text').then(text => {
                const price = this.parsePrice(text)
                expect(price).to.be.a('number').and.not.be.NaN
                
                const expectedSubtotal = price * expectedQuantity
                cy.get('td').eq(6).invoke('text').then(text => {
                    const subtotal = this.parsePrice(text)
                    expect(subtotal).to.be.a('number').and.not.be.NaN
                    expect(subtotal).to.equal(expectedSubtotal)
                })
            })
        })
    }

    validateCartTotal() {
        let calculatedTotal = 0
        
        // Para cada produto no carrinho
        cy.get('tr').each(($row) => {
            const productName = $row.find('td').eq(0).text().trim()
            if (productName && productName !== 'Sub Total:') {
                cy.wrap($row).within(() => {
                    cy.get('input[name*="EST-"]').invoke('val').then(quantity => {
                        const qty = parseInt(quantity)
                        expect(qty).to.be.a('number').and.not.be.NaN
                        
                        cy.get('td').eq(5).invoke('text').then(text => {
                            const price = this.parsePrice(text)
                            expect(price).to.be.a('number').and.not.be.NaN
                            calculatedTotal += price * qty
                        })
                    })
                })
            }
        }).then(() => {
            // Validar o total do carrinho
            this.elements.subTotalRow().within(() => {
                cy.get('td').eq(1).invoke('text').then(text => {
                    const total = this.parsePrice(text)
                    expect(total).to.be.a('number').and.not.be.NaN
                    expect(total).to.equal(calculatedTotal)
                })
            })
        })
    }

    validateEmptyCart() {
        this.elements.cartTable().should('be.visible')
        this.elements.subTotalRow().within(() => {
            cy.get('td').eq(1).invoke('text').then(text => {
                const total = this.parsePrice(text)
                expect(total).to.be.a('number').and.not.be.NaN
                expect(total).to.equal(0)
            })
        })
    }
}

export default new ProductPage() 