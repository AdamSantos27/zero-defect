describe('Login API Tests', () => {
    const baseUrl = 'http://38.211.128.218:65500/jpetstore/actions/Account.action'
    
    it('deve fazer login com credenciais válidas', () => {
        cy.api({
            method: 'POST',
            url: baseUrl,
            form: true,
            body: {
                username: '18221',
                password: '12345678',
                signon: 'Login'
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('Welcome')
        })
    })

    it('deve falhar ao fazer login com credenciais inválidas', () => {
        cy.api({
            method: 'POST',
            url: baseUrl,
            form: true,
            body: {
                username: 'usuario_invalido',
                password: 'senha_invalida',
                signon: 'Login'
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('Invalid username or password')
        })
    })

    it('deve falhar ao fazer login com username correto e password incorreto', () => {
        cy.api({
            method: 'POST',
            url: baseUrl,
            form: true,
            body: {
                username: '18221',
                password: 'senha_incorreta',
                signon: 'Login'
            }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.include('Invalid username or password')
        })
    })
}) 