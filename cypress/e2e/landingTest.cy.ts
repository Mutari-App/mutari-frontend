describe('landing page', () => {
  const uniqueEmail = `testuser+${Date.now()}@example.com`

  it('should allow user to navigate and complete registration', () => {
    cy.visit('/')

    // Pastikan tombol CTA muncul & bisa diklik
    cy.get('[data-cy="button-hero"]').should('exist').click()

    // Pastikan URL berubah ke praregistrasi
    cy.url().should('include', '#praregistrasi')

    // Isi form registrasi (contoh input)
    cy.get('[data-cy="preregister-input-first-name"]').type('Fathan')
    cy.get('[data-cy="preregister-input-email"]').type(uniqueEmail)
    cy.get('[data-cy="preregister-input-number"]').type('8123456789')
    cy.get('[data-cy="preregister-submit-button"]').click()

    // Pastikan redirect ke halaman sukses
    cy.contains('Praregistrasi berhasil!', { timeout: 7000 }).should(
      'be.visible'
    )
  })
})
