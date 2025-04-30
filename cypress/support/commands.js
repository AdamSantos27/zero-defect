// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
    cy.visit('/')
    cy.get('a').contains('Enter the Store').click()
    cy.wait(2000)
    cy.get('a').contains('Sign In').click()
    cy.wait(2000)
    cy.get('input[name="username"]').type(username)
    cy.get('input[name="password"]').clear().type(password)
    cy.get('input[name="signon"]').click()
    cy.wait(2000)
})

Cypress.Commands.add('validateLoginSuccess', () => {
    cy.get('#WelcomeContent').should('be.visible')
        .and('contain', 'Welcome')
})

Cypress.Commands.add('validateLoginError', () => {
    cy.get('#Content').should('be.visible')
        .and('contain', 'Invalid username or password')
})

Cypress.Commands.add('getProductPrice', (productName) => {
    return cy.contains('tr', productName).within(() => {
        return cy.get('td').eq(3).invoke('text').then(text => {
            const price = parseFloat(text.replace('$', '').trim())
            return price
        })
    })
})

Cypress.Commands.add('getProductQuantity', (productName) => {
    return cy.contains('tr', productName).within(() => {
        return cy.get('input[name*="EST-"]').invoke('val').then(val => {
            return parseInt(val) || 0
        })
    })
})

Cypress.Commands.add('getProductSubtotal', (productName) => {
    return cy.contains('tr', productName).within(() => {
        return cy.get('td').eq(4).invoke('text').then(text => {
            const subtotal = parseFloat(text.replace('$', '').trim())
            return subtotal
        })
    })
})

Cypress.Commands.add('getCartTotal', () => {
    return cy.contains('tr', 'Sub Total:').within(() => {
        return cy.get('td').eq(1).invoke('text').then(text => {
            const total = parseFloat(text.replace('$', '').trim())
            return total
        })
    })
})

Cypress.Commands.add('validateProductInCart', (productName, expectedQuantity) => {
    // Verificar se o produto está visível
    cy.contains('tr', productName).should('be.visible')
    
    // Verificar a quantidade
    cy.getProductQuantity(productName).should('equal', expectedQuantity)
    
    // Verificar se o subtotal está correto
    cy.getProductPrice(productName).then(price => {
        const expectedSubtotal = price * expectedQuantity
        cy.getProductSubtotal(productName).should('equal', expectedSubtotal)
    })
})

Cypress.Commands.add('validateCartTotal', () => {
    let calculatedTotal = 0
    
    // Para cada produto no carrinho
    cy.get('table[border="1"] tr').each(($row) => {
        const productName = $row.find('td').eq(0).text().trim()
        if (productName && productName !== 'Sub Total:') {
            cy.getProductQuantity(productName).then(quantity => {
                cy.getProductPrice(productName).then(price => {
                    calculatedTotal += price * quantity
                })
            })
        }
    }).then(() => {
        // Validar o total do carrinho
        cy.getCartTotal().should('equal', calculatedTotal)
    })
}) 