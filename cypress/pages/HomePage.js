class HomePage {
    elements = {
        enterStoreLink: () => cy.get('a').contains('Enter the Store'),
        searchInput: () => cy.get('input[name="keyword"]'),
        searchButton: () => cy.get('input[name="searchProducts"]'),
        menuCategories: () => cy.get('a[href*="categoryId="]'),
        searchResults: () => cy.get('#Catalog table tr'),
        welcomeMessage: () => cy.get('#WelcomeContent')
    }

    visit() {
        cy.visit('/')
        cy.wait(2000) // Aguardar carregamento inicial da página
        this.elements.enterStoreLink().click()
    }

    validateMenuCategories() {
        const expectedCategories = ['Fish', 'Dogs', 'Reptiles', 'Cats', 'Birds']
        cy.wait(2000) // Aguardar carregamento do menu
        expectedCategories.forEach(category => {
            cy.get(`a[href*="categoryId="][href*="${category.toLowerCase()}"]`).should('be.visible')
        })
    }

    searchForProduct(productName) {
        cy.wait(1000) // Aguardar carregamento da barra de pesquisa
        this.elements.searchInput().should('be.visible').clear().type(productName)
        this.elements.searchButton().should('be.visible').click()
        cy.wait(2000) // Aguardar resultados da pesquisa
    }

    validateSearchResults() {
        cy.get('#Catalog').should('be.visible')
        this.elements.searchResults().should('be.visible')
            .and('have.length.at.least', 1)
    }

    isLoggedIn() {
        this.elements.welcomeMessage().should('be.visible')
            .and('contain', 'Welcome')
    }

    validateCategoryExists(categoryName) {
        cy.wait(2000) // Aguardar carregamento do menu
        const categoryMap = {
            'peixes': 'FISH',
            'cachorros': 'DOGS',
            'repteis': 'REPTILES',
            'gatos': 'CATS',
            'passaros': 'BIRDS'
        }

        const categoryId = categoryMap[categoryName.toLowerCase()]
        
        cy.wrap(categoryId).should('exist', `Categoria "${categoryName}" não encontrada no mapeamento`)
            .then(() => {
                cy.get(`a[href*="categoryId=${categoryId}"]`).should('be.visible')
            })
    }
}

export default new HomePage() 