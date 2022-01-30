export default {
  '@context': 'http://schema.org/',
  '@type': 'WebApplication',
  name: 'Glif Sender',
  description: 'A lightweight web interface to send and receive Filecoin.',
  url: 'https://sender.glif.io',
  knowsAbout: [
    {
      '@type': 'SoftwareApplication',
      name: 'Filecoin',
      url: 'https://filecoin.io',
      applicationCategory: 'Blockchain network',
      operatingSystem: 'All'
    },
    {
      '@type': 'Corporation',
      name: 'Ledger SAS',
      url: 'https://www.ledger.com/'
    }
  ],
  parentOrganization: {
    '@type': 'Organization',
    name: 'Glif',
    description: '.',
    url: 'https://apps.glif.io'
  }
}
