import ProductPage from '../pages/ProductPage'

describe('JPetStore Cart Operations', () => {
    let productData;

    beforeEach(() => {
        // Login antes de cada teste
        cy.login('18221', '12345678')
        cy.validateLoginSuccess()
        // Carregar dados dos produtos
        cy.fixture('productData').then(data => {
            productData = data;
        })
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
            // Navegar para o produto Angelfish antes de cada teste do carrinho
            cy.get('a[href*="FISH"]').first().click()
            cy.wait(2000)
            cy.get('a[href*="productId=FI-SW-01"]').first().click()
            cy.wait(2000)
        })

        it('deve adicionar produto ao carrinho e validar informações', () => {
            // Adicionar produto ao carrinho
            ProductPage.addToCart()
            cy.wait(2000)

            // Validar que o carrinho está visível
            cy.get('#Cart').should('be.visible')

            // Validar informações do produto
            cy.contains('tr', 'Angelfish').should('be.visible')
            
            // Validar quantidade
            cy.contains('tr', 'Angelfish').within(() => {
                cy.get('input[name*="EST-"]').should('have.value', '1')
            })
            
            // Capturar e validar o preço
            cy.contains('tr', 'Angelfish').within(() => {
                cy.get('td').eq(5).invoke('text').then(text => {
                    const price = parseFloat(text.replace('$', '').trim())
                    expect(price).to.equal(16.50)
                })
            })
        })

        it('deve atualizar a quantidade do produto no carrinho e validar valores', () => {
            // Adicionar produto ao carrinho
            ProductPage.addToCart()
            cy.wait(2000)

            // Atualizar quantidade
            cy.get('#Cart').within(() => {
                cy.get('input[name*="EST-"]').clear().type('2')
                cy.get('input[type="submit"][value="Update Cart"]').click()
            })
            cy.wait(2000)

            // Validar informações atualizadas
            cy.contains('tr', 'Angelfish').within(() => {
                cy.get('input[name*="EST-"]').should('have.value', '2')
                cy.get('td').eq(5).invoke('text').then(text => {
                    const price = parseFloat(text.replace('$', '').trim())
                    expect(price).to.equal(16.50)
                })
                cy.get('td').eq(6).invoke('text').then(text => {
                    const subtotal = parseFloat(text.replace('$', '').trim())
                    expect(subtotal).to.equal(33.00)
                })
            })
        })

        it('deve validar o total do carrinho após atualização da quantidade', () => {
            // Adicionar produto ao carrinho
            ProductPage.addToCart()
            cy.wait(2000)

            // Atualizar quantidade
            cy.get('#Cart').within(() => {
                cy.get('input[name*="EST-"]').clear().type('3')
                cy.get('input[type="submit"][value="Update Cart"]').click()
            })
            cy.wait(2000)

            // Validar informações atualizadas
            cy.contains('tr', 'Angelfish').within(() => {
                cy.get('input[name*="EST-"]').should('have.value', '3')
                cy.get('td').eq(5).invoke('text').then(text => {
                    const price = parseFloat(text.replace('$', '').trim())
                    expect(price).to.equal(16.50)
                })
                cy.get('td').eq(6).invoke('text').then(text => {
                    const subtotal = parseFloat(text.replace('$', '').trim())
                    expect(subtotal).to.equal(49.50)
                })
            })
        })

        it('deve remover produto do carrinho', () => {
            // Adicionar produto ao carrinho
            ProductPage.addToCart()
            cy.wait(2000)

            // Remover produto
            cy.get('#Cart').within(() => {
                cy.get('a[href*="removeItemFromCart"]').click()
            })
            cy.wait(2000)

            // Validar que o carrinho está vazio
            cy.get('#Cart').should('be.visible')
            cy.contains('tr', 'Angelfish').should('not.exist')
            
            // Validar mensagem de carrinho vazio
            cy.get('#Cart').within(() => {
                cy.contains('td', 'Your cart is empty.').should('be.visible')
            })
            
            // Validar total do carrinho
            cy.get('#Cart').within(() => {
                cy.contains('tr', 'Sub Total:').within(() => {
                    cy.get('td').eq(0).invoke('text').then(text => {
                        const total = parseFloat(text.replace('Sub Total: $', '').trim())
                        expect(total).to.equal(0)
                    })
                })
            })
        })

        it('deve adicionar múltiplos produtos ao carrinho e validar totais', () => {
            // Adicionar primeiro produto
            ProductPage.addToCart()
            cy.wait(2000)

            // Navegar para outro produto
            cy.get('a[href*="FISH"]').first().click()
            cy.wait(2000)
            cy.get('a[href*="productId=FI-SW-02"]').first().click()
            cy.wait(2000)

            // Adicionar segundo produto
            ProductPage.addToCart()
            cy.wait(2000)

            // Validar produtos no carrinho
            cy.get('#Cart').should('be.visible')
            
            // Validar primeiro produto (Angelfish)
            cy.get('#Cart').within(() => {
                cy.contains('tr', 'Large Angelfish').within(() => {
                    cy.get('input[name="EST-1"]').should('have.value', '1')
                    cy.get('td').eq(5).invoke('text').then(text => {
                        const price = parseFloat(text.replace('$', '').trim())
                        expect(price).to.equal(16.50)
                    })
                    cy.get('td').eq(6).invoke('text').then(text => {
                        const subtotal = parseFloat(text.replace('$', '').trim())
                        expect(subtotal).to.equal(16.50)
                    })
                })

                // Validar segundo produto (Tiger Shark)
                cy.contains('tr', 'Toothless Tiger Shark').within(() => {
                    cy.get('input[name="EST-3"]').should('have.value', '1')
                    cy.get('td').eq(5).invoke('text').then(text => {
                        const price = parseFloat(text.replace('$', '').trim())
                        expect(price).to.equal(18.50)
                    })
                    cy.get('td').eq(6).invoke('text').then(text => {
                        const subtotal = parseFloat(text.replace('$', '').trim())
                        expect(subtotal).to.equal(18.50)
                    })
                })

                // Validar total do carrinho
                cy.contains('tr', 'Sub Total:').within(() => {
                    cy.get('td').eq(0).invoke('text').then(text => {
                        const total = parseFloat(text.replace('Sub Total: $', '').trim())
                        expect(total).to.equal(35.00)
                    })
                })
            })
        })

        it('deve atualizar quantidades de múltiplos produtos e validar totais', () => {
            // Adicionar primeiro produto
            ProductPage.addToCart()
            cy.wait(2000)

            // Navegar para outro produto
            cy.get('a[href*="FISH"]').first().click()
            cy.wait(2000)
            cy.get('a[href*="productId=FI-SW-02"]').first().click()
            cy.wait(2000)

            // Adicionar segundo produto
            ProductPage.addToCart()
            cy.wait(2000)

            // Atualizar quantidades
            cy.get('#Cart').within(() => {
                cy.get('input[name="EST-1"]').clear().type('2')
                cy.get('input[name="EST-3"]').clear().type('3')
                cy.get('input[name="updateCartQuantities"]').click()
            })
            cy.wait(2000)

            // Validar informações atualizadas
            cy.get('#Cart').within(() => {
                // Validar Angelfish
                cy.contains('tr', 'Large Angelfish').within(() => {
                    cy.get('input[name="EST-1"]').should('have.value', '2')
                    cy.get('td').eq(5).invoke('text').then(text => {
                        const price = parseFloat(text.replace('$', '').trim())
                        expect(price).to.equal(16.50)
                    })
                    cy.get('td').eq(6).invoke('text').then(text => {
                        const subtotal = parseFloat(text.replace('$', '').trim())
                        expect(subtotal).to.equal(33.00)
                    })
                })

                // Validar Tiger Shark
                cy.contains('tr', 'Toothless Tiger Shark').within(() => {
                    cy.get('input[name="EST-3"]').should('have.value', '3')
                    cy.get('td').eq(5).invoke('text').then(text => {
                        const price = parseFloat(text.replace('$', '').trim())
                        expect(price).to.equal(18.50)
                    })
                    cy.get('td').eq(6).invoke('text').then(text => {
                        const subtotal = parseFloat(text.replace('$', '').trim())
                        expect(subtotal).to.equal(55.50)
                    })
                })

                // Validar total do carrinho
                cy.contains('tr', 'Sub Total:').within(() => {
                    cy.get('td').eq(0).invoke('text').then(text => {
                        const total = parseFloat(text.replace('Sub Total: $', '').trim())
                        expect(total).to.equal(88.50)
                    })
                })
            })
        })
    })
}) 