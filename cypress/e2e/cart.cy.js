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

        it.only('deve adicionar produto ao carrinho e validar informações', () => {
            // Adicionar produto ao carrinho
            ProductPage.addToCart()

            // Validar que o carrinho está visível
            ProductPage.elements.cartTable().should('be.visible')

            // Validar informações do produto
            ProductPage.elements.productRow('Angelfish').should('be.visible')
            
            // Validar quantidade
            ProductPage.elements.productRow('Angelfish').within(() => {
                cy.get('input[name*="EST-"]').should('have.value', '1')
            })
            
            // Validar preço e subtotal
            ProductPage.elements.productRow('Angelfish').within(() => {
                cy.get('td').eq(3).invoke('text').then(text => {
                    cy.log('Price text:', text)
                    // Remover todos os caracteres não numéricos exceto ponto e vírgula
                    const cleanText = text.replace(/[^0-9.,]/g, '')
                    cy.log('Clean price text:', cleanText)
                    // Substituir vírgula por ponto se houver
                    const normalizedText = cleanText.replace(',', '.')
                    cy.log('Normalized price text:', normalizedText)
                    const price = parseFloat(normalizedText)
                    cy.log('Parsed price:', price)
                    
                    // Validar que o preço é um número válido
                    expect(typeof price).to.equal('number')
                    expect(Number.isFinite(price)).to.be.true
                    
                    cy.get('td').eq(4).invoke('text').then(subtotalText => {
                        cy.log('Subtotal text:', subtotalText)
                        const cleanSubtotalText = subtotalText.replace(/[^0-9.,]/g, '')
                        cy.log('Clean subtotal text:', cleanSubtotalText)
                        const normalizedSubtotalText = cleanSubtotalText.replace(',', '.')
                        cy.log('Normalized subtotal text:', normalizedSubtotalText)
                        const subtotal = parseFloat(normalizedSubtotalText)
                        cy.log('Parsed subtotal:', subtotal)
                        
                        // Validar que o subtotal é um número válido
                        expect(typeof subtotal).to.equal('number')
                        expect(Number.isFinite(subtotal)).to.be.true
                        
                        // Validar que o subtotal é igual ao preço (quantidade 1)
                        expect(subtotal).to.equal(price)
                    })
                })
            })
            
            // Validar total do carrinho
            ProductPage.elements.subTotalRow().within(() => {
                cy.get('td').eq(1).invoke('text').then(text => {
                    cy.log('Total text:', text)
                    const cleanText = text.replace(/[^0-9.,]/g, '')
                    cy.log('Clean total text:', cleanText)
                    const normalizedText = cleanText.replace(',', '.')
                    cy.log('Normalized total text:', normalizedText)
                    const total = parseFloat(normalizedText)
                    cy.log('Parsed total:', total)
                    
                    // Validar que o total é um número válido
                    expect(typeof total).to.equal('number')
                    expect(Number.isFinite(total)).to.be.true
                    
                    ProductPage.elements.productRow('Angelfish').within(() => {
                        cy.get('td').eq(3).invoke('text').then(text => {
                            cy.log('Price text for total:', text)
                            const cleanText = text.replace(/[^0-9.,]/g, '')
                            cy.log('Clean price text for total:', cleanText)
                            const normalizedText = cleanText.replace(',', '.')
                            cy.log('Normalized price text for total:', normalizedText)
                            const price = parseFloat(normalizedText)
                            cy.log('Parsed price for total:', price)
                            
                            // Validar que o preço é um número válido
                            expect(typeof price).to.equal('number')
                            expect(Number.isFinite(price)).to.be.true
                            
                            // Validar que o total é igual ao preço (quantidade 1)
                            expect(total).to.equal(price)
                        })
                    })
                })
            })
        })

        it('deve atualizar a quantidade do produto no carrinho e validar valores', () => {
            // Adicionar produto ao carrinho
            ProductPage.addToCart()

            // Atualizar quantidade
            ProductPage.updateQuantity(2)

            // Validar informações atualizadas
            ProductPage.validateProductInCart('Angelfish', 2)
            ProductPage.validateCartTotal()
        })

        it('deve validar o total do carrinho após atualização da quantidade', () => {
            // Adicionar produto ao carrinho
            ProductPage.addToCart()

            // Atualizar quantidade
            ProductPage.updateQuantity(3)

            // Validar informações atualizadas
            ProductPage.validateProductInCart('Angelfish', 3)
            ProductPage.validateCartTotal()
        })

        it('deve remover produto do carrinho', () => {
            // Adicionar produto ao carrinho
            ProductPage.addToCart()

            // Remover produto
            ProductPage.removeFromCart()

            // Validar que o produto foi removido
            ProductPage.elements.cartTable().should('be.visible')
            ProductPage.elements.productRow('Angelfish').should('not.exist')
            ProductPage.validateEmptyCart()
        })

        it('deve adicionar múltiplos produtos ao carrinho e validar totais', () => {
            // Adicionar primeiro produto
            ProductPage.addToCart()

            // Navegar para outro produto
            cy.get('a[href*="FISH"]').first().click()
            cy.wait(2000)
            cy.get('a[href*="productId=FI-SW-02"]').first().click()
            cy.wait(2000)

            // Adicionar segundo produto
            ProductPage.addToCart()

            // Validar produtos no carrinho
            ProductPage.elements.cartTable().should('be.visible')
            ProductPage.validateProductInCart('Angelfish', 1)
            ProductPage.validateProductInCart('Tiger Shark', 1)
            ProductPage.validateCartTotal()
        })

        it('deve atualizar quantidades de múltiplos produtos e validar totais', () => {
            // Adicionar primeiro produto
            ProductPage.addToCart()

            // Navegar para outro produto
            cy.get('a[href*="FISH"]').first().click()
            cy.wait(2000)
            cy.get('a[href*="productId=FI-SW-02"]').first().click()
            cy.wait(2000)

            // Adicionar segundo produto
            ProductPage.addToCart()

            // Atualizar quantidades
            ProductPage.elements.quantityInput().first().clear().type('2')
            ProductPage.elements.quantityInput().last().clear().type('3')
            ProductPage.elements.updateCartButton().click()
            cy.wait(2000)

            // Validar informações atualizadas
            ProductPage.validateProductInCart('Angelfish', 2)
            ProductPage.validateProductInCart('Tiger Shark', 3)
            ProductPage.validateCartTotal()
        })
    })
}) 