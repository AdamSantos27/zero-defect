describe('Purchase API Tests', () => {
    const baseUrl = 'http://38.211.128.218:65500/jpetstore/actions'

    beforeEach(() => {
        // Login antes de cada teste
        cy.api({
            method: 'POST',
            url: `${baseUrl}/Account.action`,
            form: true,
            body: {
                username: '18221',
                password: '12345678',
                signon: 'Login'
            }
        })
    })

    it('deve adicionar produto ao carrinho', () => {
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Cart.action?addItemToCart=&workingItemId=EST-1`,
        }).then((response) => {
            expect(response.status).to.equal(200)
            
            // Verifica se o produto está no carrinho pelo HTML
            const $html = Cypress.$(response.body)
            
            // Verifica o título do carrinho
            expect($html.find('#Cart h2').text().trim()).to.equal('Shopping Cart')
            
            // Verifica os dados do item
            const $row = $html.find('td').filter((i, el) => Cypress.$(el).text().includes('EST-1')).closest('tr')
            expect($row.length).to.be.greaterThan(0)
            
            const cells = $row.find('td')
            expect(Cypress.$(cells[0]).text().trim()).to.equal('EST-1')
            expect(Cypress.$(cells[1]).text().trim()).to.equal('FI-SW-01')
            expect(Cypress.$(cells[2]).text().trim().replace(/\s+/g, ' ')).to.equal('Large Angelfish')
            expect(Cypress.$(cells[3]).text().trim()).to.equal('true')
            expect(Cypress.$(cells[5]).text().trim()).to.equal('$16.50')
            expect(Cypress.$(cells[6]).text().trim()).to.equal('$16.50')
            
            // Verifica o subtotal
            const subtotalText = $html.find('td:contains("Sub Total")').text().trim()
            expect(subtotalText).to.include('Sub Total: $16.50')
            
            // Verifica o botão de checkout
            const checkoutText = $html.find('a.Button').last().text().trim()
            expect(checkoutText).to.equal('Proceed to Checkout')
        })
    })

    it('deve remover produto do carrinho', () => {
        // Primeiro adiciona o produto
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Cart.action?addItemToCart=&workingItemId=EST-1`,
        })

        // Depois remove
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Cart.action?removeItemFromCart=&workingItemId=EST-1`,
        }).then((response) => {
            expect(response.status).to.equal(200)
            
            // Verifica se o carrinho está vazio pelo HTML
            const $html = Cypress.$(response.body)
            
            // Verifica o título do carrinho
            expect($html.find('#Cart h2').text().trim()).to.equal('Shopping Cart')
            
            // Verifica a mensagem de carrinho vazio
            const emptyCartMessage = $html.find('td:contains("Your cart is empty")').text().trim()
            expect(emptyCartMessage).to.equal('Your cart is empty.')
            
            // Verifica o subtotal zerado
            const subtotalText = $html.find('td:contains("Sub Total")').text().trim()
            expect(subtotalText).to.include('Sub Total: $0')
            
            // Verifica que não há itens na tabela
            const itemRows = $html.find('tr').filter((i, el) => {
                const $el = Cypress.$(el)
                return $el.find('td').length === 8 && !$el.text().includes('Your cart is empty')
            })
            expect(itemRows.length).to.equal(0)
        })
    })

    it('deve completar o processo de compra', () => {
        // Adiciona produto ao carrinho
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Cart.action`,
            qs: {
                addItemToCart: '',
                workingItemId: 'EST-1'
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('Shopping Cart')
        })

        // Abre o formulário de pedido
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Order.action`,
            qs: {
                newOrderForm: ''
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('Payment Details')
        })

        // Preenche e envia o formulário de pedido
        cy.api({
            method: 'POST',
            url: `${baseUrl}/Order.action`,
            form: true,
            body: {
                'order.cardType': 'Visa',
                'order.creditCard': '999 9999 9999 9999',
                'order.expiryDate': '12/25',
                'order.billToFirstName': 'Test',
                'order.billToLastName': 'User',
                'order.billAddress1': '123 Test St',
                'order.billAddress2': '',
                'order.billCity': 'Test City',
                'order.billState': 'TS',
                'order.billZip': '12345',
                'order.billCountry': 'USA',
                shippingAddressRequired: 'false',
                newOrder: 'Continue'
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('Please confirm the information below')
        })

        // Confirma o pedido
        cy.api({
            method: 'POST',
            url: `${baseUrl}/Order.action`,
            form: true,
            body: {
                confirmed: 'true',
                newOrder: ''
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            
            // Verifica a mensagem de sucesso
            expect(response.body).to.include('Thank you, your order has been submitted.')
            
            // Verifica os detalhes do pedido
            const $html = Cypress.$(response.body)
            
            // Verifica o número do pedido
            const orderNumber = $html.find('th:contains("Order #")').text()
            expect(orderNumber).to.match(/Order #\d+/)
            
            // Verifica os detalhes de pagamento
            expect($html.find('td:contains("Visa")').length).to.be.greaterThan(0)
            expect($html.find('td:contains("999 9999 9999 9999")').length).to.be.greaterThan(0)
            expect($html.find('td:contains("12/25")').length).to.be.greaterThan(0)
            
            // Verifica o endereço de cobrança
            expect($html.find('td:contains("Test")').length).to.be.greaterThan(0)
            expect($html.find('td:contains("User")').length).to.be.greaterThan(0)
            expect($html.find('td:contains("123 Test St")').length).to.be.greaterThan(0)
            expect($html.find('td:contains("Test City")').length).to.be.greaterThan(0)
            expect($html.find('td:contains("TS")').length).to.be.greaterThan(0)
            expect($html.find('td:contains("12345")').length).to.be.greaterThan(0)
            expect($html.find('td:contains("USA")').length).to.be.greaterThan(0)
            
            // Verifica os itens do pedido
            expect($html.find('td:contains("EST-1")').length).to.be.greaterThan(0)
            
            // Verifica a descrição do item
            const itemRow = $html.find('td:contains("EST-1")').closest('tr')
            const itemDescription = itemRow.find('td').filter((i, el) => {
                const text = Cypress.$(el).text().trim()
                return text.includes('Large') || text.includes('Angelfish')
            }).text().trim()
            
            expect(itemDescription).to.include('Large')
            expect(itemDescription).to.include('Angelfish')
            
            expect($html.find('td:contains("$16.50")').length).to.be.greaterThan(0)
            
            // Verifica o total
            expect($html.find('th:contains("Total: $16.50")').length).to.be.greaterThan(0)
            
            // Verifica o link de retorno
            expect($html.find('a:contains("Return to Main Menu")').length).to.be.greaterThan(0)
        })
    })

    it('deve abrir o formulário de pedido', () => {
        // Primeiro adiciona um produto ao carrinho
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Cart.action?addItemToCart=&workingItemId=EST-1`,
        })

        // Abre o formulário de pedido
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Order.action?newOrderForm=`,
        }).then((response) => {
            expect(response.status).to.equal(200)
            
            // Verifica se estamos na URL correta
            expect(response.allRequestResponses[0]['Request URL']).to.include('/Order.action?newOrderForm=')
            
            // Verifica se há um formulário na página
            const $html = Cypress.$(response.body)
            const forms = $html.find('form')
            expect(forms.length).to.be.greaterThan(0, 'Deve haver pelo menos um formulário na página')
            
            // Verifica se há campos de entrada no formulário
            const inputs = forms.find('input')
            expect(inputs.length).to.be.greaterThan(0, 'Deve haver campos de entrada no formulário')
        })
    })

    it('deve verificar os campos do formulário de pedido', () => {
        // Primeiro adiciona um produto ao carrinho
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Cart.action?addItemToCart=&workingItemId=EST-1`,
        })

        // Abre o formulário de pedido
        cy.api({
            method: 'GET',
            url: `${baseUrl}/Order.action?newOrderForm=`,
        }).then((response) => {
            expect(response.status).to.equal(200)
            
            // Verifica se estamos na URL correta
            expect(response.allRequestResponses[0]['Request URL']).to.include('/Order.action?newOrderForm=')
            
            // Verifica se há um formulário na página
            const $html = Cypress.$(response.body)
            const form = $html.find('form')
            expect(form.length).to.be.greaterThan(0, 'Deve haver um formulário na página')
            
            // Verifica o método e action do formulário
            expect(form.attr('method')).to.equal('post', 'O método do formulário deve ser POST')
            
            // Encontra o formulário de pedido correto
            const orderForm = $html.find('form[action="/jpetstore/actions/Order.action"]')
            expect(orderForm.length).to.equal(1, 'Deve haver um formulário de pedido')
            expect(orderForm.attr('action')).to.equal('/jpetstore/actions/Order.action', 'A action do formulário deve estar correta')

            // Verifica os campos hidden
            const hiddenFields = orderForm.find('input[type="hidden"]')
            expect(hiddenFields.length).to.equal(2, 'Deve haver dois campos hidden')
            expect(hiddenFields.filter('[name="_sourcePage"]').length).to.equal(1, 'Deve haver um campo _sourcePage')
            expect(hiddenFields.filter('[name="__fp"]').length).to.equal(1, 'Deve haver um campo __fp')

            // Verifica as opções do tipo de cartão
            const cardTypeSelect = orderForm.find('select[name="order.cardType"]')
            expect(cardTypeSelect.length).to.equal(1, 'Deve haver um select para o tipo de cartão')
            const cardTypeOptions = cardTypeSelect.find('option')
            expect(cardTypeOptions.length).to.equal(3, 'Deve haver três opções de cartão')
            expect(cardTypeOptions.eq(0).val()).to.equal('Visa', 'A primeira opção deve ser Visa')
            expect(cardTypeOptions.eq(1).val()).to.equal('MasterCard', 'A segunda opção deve ser MasterCard')
            expect(cardTypeOptions.eq(2).val()).to.equal('American Express', 'A terceira opção deve ser American Express')

            // Verifica os campos de pagamento
            expect(cardTypeSelect.find('option[selected]').val()).to.equal('Visa', 'Visa deve ser o tipo de cartão selecionado por padrão')
            
            const creditCardInput = orderForm.find('input[name="order.creditCard"]')
            expect(creditCardInput.length).to.equal(1, 'Deve haver um input para o número do cartão')
            expect(creditCardInput.val()).to.equal('999 9999 9999 9999', 'O número do cartão deve ter o valor padrão correto')
            
            const expiryDateInput = orderForm.find('input[name="order.expiryDate"]')
            expect(expiryDateInput.length).to.equal(1, 'Deve haver um input para a data de expiração')
            expect(expiryDateInput.val()).to.equal('12/03', 'A data de expiração deve ter o valor padrão correto')
            
            // Verifica os campos de endereço
            const firstNameInput = orderForm.find('input[name="order.billToFirstName"]')
            expect(firstNameInput.length).to.equal(1, 'Deve haver um input para o primeiro nome')
            expect(firstNameInput.val()).to.equal('Iago', 'O primeiro nome deve ter o valor padrão correto')
            
            const lastNameInput = orderForm.find('input[name="order.billToLastName"]')
            expect(lastNameInput.length).to.equal(1, 'Deve haver um input para o sobrenome')
            expect(lastNameInput.val()).to.equal('GonÃ§alves', 'O sobrenome deve ter o valor padrão correto')
            
            const address1Input = orderForm.find('input[name="order.billAddress1"]')
            expect(address1Input.length).to.equal(1, 'Deve haver um input para o endereço 1')
            expect(address1Input.val()).to.equal('Bairro Jangurussu', 'O endereço 1 deve ter o valor padrão correto')
            
            const cityInput = orderForm.find('input[name="order.billCity"]')
            expect(cityInput.length).to.equal(1, 'Deve haver um input para a cidade')
            expect(cityInput.val()).to.equal('Fortaleza', 'A cidade deve ter o valor padrão correto')
            
            const stateInput = orderForm.find('input[name="order.billState"]')
            expect(stateInput.length).to.equal(1, 'Deve haver um input para o estado')
            expect(stateInput.val()).to.equal('CE', 'O estado deve ter o valor padrão correto')
            
            const zipInput = orderForm.find('input[name="order.billZip"]')
            expect(zipInput.length).to.equal(1, 'Deve haver um input para o CEP')
            expect(zipInput.val()).to.equal('60866635', 'O CEP deve ter o valor padrão correto')
            
            const countryInput = orderForm.find('input[name="order.billCountry"]')
            expect(countryInput.length).to.equal(1, 'Deve haver um input para o país')
            expect(countryInput.val()).to.equal('brasil', 'O país deve ter o valor padrão correto')
            
            // Verifica o checkbox de endereço de entrega diferente
            const shippingCheckbox = orderForm.find('input[name="shippingAddressRequired"]')
            expect(shippingCheckbox.length).to.equal(1, 'Deve haver um checkbox para endereço de entrega diferente')
            expect(shippingCheckbox.prop('checked')).to.be.false
            
            // Verifica o botão de continuar
            const continueButton = orderForm.find('input[name="newOrder"]')
            expect(continueButton.length).to.equal(1, 'Deve haver um botão de continuar')
            expect(continueButton.val()).to.equal('Continue', 'O botão deve ter o texto correto')
        })
    })
}) 