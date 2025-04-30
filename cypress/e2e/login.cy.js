describe('JPetStore Login Tests', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('a').contains('Enter the Store').click()
        cy.wait(2000)
    })

    describe('Login Functionality', () => {
        it('deve realizar login com sucesso usando credenciais válidas', () => {
            cy.login('18221', '12345678')
            cy.validateLoginSuccess()
        })

        it('deve exibir mensagem de erro ao tentar login com senha inválida', () => {
            cy.login('18221', 'senhaerrada')
            cy.validateLoginError()
        })

        it('deve exibir mensagem de erro ao tentar login com usuário inválido', () => {
            cy.login('usuarioinexistente', '12345678')
            cy.validateLoginError()
        })

        it('deve exibir mensagem de erro ao tentar login com usuário e senha inválidos', () => {
            cy.login('usuarioinexistente', 'senhaerrada')
            cy.validateLoginError()
        })

        it('deve exibir mensagem de erro ao tentar login com usuário vazio', () => {
            cy.get('a').contains('Sign In').click()
            cy.wait(2000)
            cy.get('input[name="password"]').type('12345678')
            cy.get('input[name="signon"]').click()
            cy.validateLoginError()
        })

        it('deve exibir mensagem de erro ao tentar login com senha vazia', () => {
            cy.get('a').contains('Sign In').click()
            cy.wait(2000)
            cy.get('input[name="username"]').type('18221')
            cy.get('input[name="signon"]').click()
            cy.validateLoginError()
        })

        it('deve exibir mensagem de erro ao tentar login com usuário e senha vazios', () => {
            cy.get('a').contains('Sign In').click()
            cy.wait(2000)
            cy.get('input[name="signon"]').click()
            cy.validateLoginError()
        })
    })

    describe('Login Form Validation', () => {
        beforeEach(() => {
            cy.get('a').contains('Sign In').click()
            cy.wait(2000)
        })

        it('deve validar que o campo de usuário está visível e habilitado', () => {
            cy.get('input[name="username"]')
                .should('be.visible')
                .and('be.enabled')
        })

        it('deve validar que o campo de senha está visível e habilitado', () => {
            cy.get('input[name="password"]')
                .should('be.visible')
                .and('be.enabled')
        })

        it('deve validar que o botão de login está visível e habilitado', () => {
            cy.get('input[name="signon"]')
                .should('be.visible')
                .and('be.enabled')
        })
    })
}) 