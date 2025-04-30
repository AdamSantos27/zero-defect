import HomePage from '../pages/HomePage'
import ProductPage from '../pages/ProductPage'

describe('JPetStore Cart Operations', () => {
    beforeEach(() => {
        // Login before each test
        cy.login('18221', '12345678')
        cy.validateLoginSuccess()
    })

    describe('Product Navigation', () => {
        it('deve navegar para a categoria Peixes', () => {
            cy.get('a[href*="FISH"]').first().click()
            cy.wait(2000)
            cy.url().should('include', 'categoryId=FISH')
        })

        it('deve selecionar o produto Peixe Anjo', () => {
            cy.get('a[href*="FISH"]').first().click()
            cy.wait(2000)
            cy.get('a[href*="productId=FI-SW-01"]').first().click()
            cy.wait(2000)
            cy.url().should('include', 'productId=FI-SW-01')
        })
    })

    describe('Cart Operations', () => {
        beforeEach(() => {
            // Navigate to Angelfish product before each cart test
            cy.get('a[href*="FISH"]').first().click()
            cy.wait(2000)
            cy.get('a[href*="productId=FI-SW-01"]').first().click()
            cy.wait(2000)
        })

        it('deve adicionar produto ao carrinho e validar informações', () => {
            // Adicionar produto ao carrinho
            cy.get('a[href*="addItemToCart"]').first().click()
            cy.wait(2000)

            // Validar que o carrinho está visível
            cy.get('#Cart').should('be.visible')

            // Validar informações do produto
            cy.validateProductInCart('Angelfish', 1)
            
            // Validar total do carrinho
            cy.validateCartTotal()
        })

        it('deve atualizar a quantidade do produto no carrinho e validar valores', () => {
            // Adicionar produto ao carrinho
            cy.get('a[href*="addItemToCart"]').first().click()
            cy.wait(2000)

            // Atualizar quantidade
            cy.get('input[name*="EST-"]').first().clear().type('2')
            cy.get('input[type="submit"][value="Update Cart"]').click()
            cy.wait(2000)

            // Validar informações atualizadas
            cy.validateProductInCart('Angelfish', 2)
            cy.validateCartTotal()
        })

        it('deve validar o total do carrinho após atualização da quantidade', () => {
            // Adicionar produto ao carrinho
            cy.get('a[href*="addItemToCart"]').first().click()
            cy.wait(2000)

            // Atualizar quantidade
            cy.get('input[name*="EST-"]').first().clear().type('3')
            cy.get('input[type="submit"][value="Update Cart"]').click()
            cy.wait(2000)

            // Validar informações atualizadas
            cy.validateProductInCart('Angelfish', 3)
            cy.validateCartTotal()
        })

        it('deve remover produto do carrinho', () => {
            // Adicionar produto ao carrinho
            cy.get('a[href*="addItemToCart"]').first().click()
            cy.wait(2000)

            // Remover produto
            cy.get('a[href*="removeItemFromCart"]').first().click()
            cy.wait(2000)

            // Validar que o produto foi removido
            cy.get('#Cart').should('be.visible')
            cy.contains('tr', 'Angelfish').should('not.exist')
            cy.getCartTotal().should('equal', 0)
        })

        it('deve adicionar múltiplos produtos ao carrinho e validar totais', () => {
            // Adicionar primeiro produto
            cy.get('a[href*="addItemToCart"]').first().click()
            cy.wait(2000)

            // Navegar para outro produto
            cy.get('a[href*="FISH"]').first().click()
            cy.wait(2000)
            cy.get('a[href*="productId=FI-SW-02"]').first().click()
            cy.wait(2000)

            // Adicionar segundo produto
            cy.get('a[href*="addItemToCart"]').first().click()
            cy.wait(2000)

            // Validar produtos no carrinho
            cy.get('#Cart').should('be.visible')
            cy.validateProductInCart('Angelfish', 1)
            cy.validateProductInCart('Tiger Shark', 1)
            cy.validateCartTotal()
        })

        it('deve atualizar quantidades de múltiplos produtos e validar totais', () => {
            // Adicionar primeiro produto
            cy.get('a[href*="addItemToCart"]').first().click()
            cy.wait(2000)

            // Navegar para outro produto
            cy.get('a[href*="FISH"]').first().click()
            cy.wait(2000)
            cy.get('a[href*="productId=FI-SW-02"]').first().click()
            cy.wait(2000)

            // Adicionar segundo produto
            cy.get('a[href*="addItemToCart"]').first().click()
            cy.wait(2000)

            // Atualizar quantidades
            cy.get('input[name*="EST-"]').first().clear().type('2')
            cy.get('input[name*="EST-"]').last().clear().type('3')
            cy.get('input[type="submit"][value="Update Cart"]').click()
            cy.wait(2000)

            // Validar informações atualizadas
            cy.validateProductInCart('Angelfish', 2)
            cy.validateProductInCart('Tiger Shark', 3)
            cy.validateCartTotal()
        })
    })
}) 