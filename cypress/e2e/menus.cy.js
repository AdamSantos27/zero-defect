import HomePage from '../pages/HomePage'

describe('JPetStore Menu Categories Tests', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('a').contains('Enter the Store').click()
        cy.wait(2000)
    })

    describe('Menu Categories Validation', () => {
        it('deve validar que a categoria Peixes está visível', () => {
            HomePage.validateCategoryExists('peixes')
        })

        it('deve validar que a categoria Cachorros está visível', () => {
            HomePage.validateCategoryExists('cachorros')
        })

        it('deve validar que a categoria Répteis está visível', () => {
            HomePage.validateCategoryExists('repteis')
        })

        it('deve validar que a categoria Gatos está visível', () => {
            HomePage.validateCategoryExists('gatos')
        })

        it('deve validar que a categoria Pássaros está visível', () => {
            HomePage.validateCategoryExists('passaros')
        })
    })
}) 