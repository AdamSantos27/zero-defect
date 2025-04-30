import HomePage from '../pages/HomePage'

describe('JPetStore Search Functionality Tests', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('a').contains('Enter the Store').click()
        cy.wait(2000)
    })

    describe('Search Functionality', () => {
        it('deve buscar por produtos de peixe e validar os resultados', () => {
            // Search for fish products
            cy.get('input[name="keyword"]').should('be.visible').clear().type('fish')
            cy.get('input[name="searchProducts"]').click()
            cy.wait(2000)

            // Validate search results
            cy.get('#Catalog').should('be.visible')
            cy.get('#Catalog table tr').should('have.length.at.least', 1)
        })

        it('deve validar que o campo de busca está visível e habilitado', () => {
            cy.get('input[name="keyword"]')
                .should('be.visible')
                .and('be.enabled')
        })

        it('deve validar que o botão de busca está visível e habilitado', () => {
            cy.get('input[name="searchProducts"]')
                .should('be.visible')
                .and('be.enabled')
        })
    })
}) 