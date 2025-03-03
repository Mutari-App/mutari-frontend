describe('landing page', () => {
  const uniqueEmail = `testuser+${Date.now()}@example.com`
  beforeEach(() => {
    cy.visit('/')
  })

  it('should allow user to navigate and complete registration', () => {
    // Pastikan tombol CTA muncul & bisa diklik
    cy.getBySel('button-hero').should('exist').click()

    // Pastikan URL berubah ke praregistrasi
    cy.url().should('include', '#praregistrasi')

    // Isi form registrasi (contoh input)
    cy.getBySel('preregister-input-first-name').type('Fathan')
    cy.getBySel('preregister-input-email').type(uniqueEmail)
    cy.getBySel('preregister-input-number').type('8123456789')
    cy.getBySel('preregister-submit-button').click()

    // Pastikan redirect ke halaman sukses
    cy.contains('Praregistrasi berhasil!', { timeout: 7000 }).should(
      'be.visible'
    )
  })
})
