describe('Cart API Tests', () => {
    const baseUrl = 'http://38.211.128.218:65500/jpetstore/actions'
    
    it('deve adicionar um item ao carrinho', () => {
        let sessionId;

        // 1. Acessar a página inicial para obter o cookie de sessão
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Catalog.action`
        }).then((response) => {
            expect(response.status).to.equal(200)
            // Extrair o cookie de sessão
            const cookies = response.headers['set-cookie']
            if (cookies) {
                sessionId = cookies[0].split(';')[0]
            }
        })

        // 2. Acessar a categoria FISH
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Catalog.action`,
            headers: {
                'Cookie': sessionId
            },
            qs: {
                viewCategory: '',
                categoryId: 'FISH'
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
        })

        // 3. Acessar o produto Angelfish
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Catalog.action`,
            headers: {
                'Cookie': sessionId
            },
            qs: {
                viewProduct: '',
                productId: 'FI-SW-01'
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
        })

        // 4. Adicionar o item ao carrinho usando POST
        cy.api({
            method: 'POST',
            url: `${baseUrl}/Cart.action`,
            headers: {
                'Cookie': sessionId,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: true,
            body: {
                workingItemId: 'EST-1',
                addItemToCart: ''
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('Shopping Cart')
            expect(response.body).to.include('Angelfish')
            expect(response.body).to.include('$16.50')
        })

        // 5. Verificar o carrinho
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Cart.action`,
            headers: {
                'Cookie': sessionId
            },
            qs: {
                viewCart: ''
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('Shopping Cart')
            expect(response.body).to.include('Angelfish')
            expect(response.body).to.include('$16.50')
        })

        // 6. Tentar finalizar a compra (deve redirecionar para login)
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Order.action`,
            headers: {
                'Cookie': sessionId
            },
            qs: {
                newOrderForm: ''
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('You must sign on before attempting to check out')
        })
    })

    it('deve finalizar a compra após login', () => {
        let sessionId;

        // 1. Fazer login
        cy.api({
            method: 'POST',
            url: `${baseUrl}/Account.action`,
            form: true,
            body: {
                username: '18221',
                password: '12345678',
                signon: 'Login'
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            // Extrair o cookie de sessão
            const cookies = response.headers['set-cookie']
            if (cookies) {
                sessionId = cookies[0].split(';')[0]
            }
        })

        // 2. Adicionar item ao carrinho
        cy.api({
            method: 'POST',
            url: `${baseUrl}/Cart.action`,
            headers: {
                'Cookie': sessionId,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: true,
            body: {
                workingItemId: 'EST-1',
                addItemToCart: ''
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('Shopping Cart')
        })

        // 3. Verificar o carrinho
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Cart.action`,
            headers: {
                'Cookie': sessionId
            },
            qs: {
                viewCart: ''
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('Shopping Cart')
            expect(response.body).to.include('Angelfish')
        })

        // 4. Iniciar o processo de checkout
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Order.action`,
            headers: {
                'Cookie': sessionId
            },
            qs: {
                newOrderForm: ''
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
        })

        // 5. Confirmar o pedido
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Order.action`,
            headers: {
                'Cookie': sessionId
            },
            qs: {
                newOrder: '',
                confirmed: 'true'
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('Thank you, your order has been submitted')
        })
    })
}) 