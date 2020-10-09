export default {
  '@context': 'http://schema.org/',
  '@type': 'WebApplication',
  name: 'Glif Wallet',
  description:
    'A lightweight web interface to send and receive Filecoin via your Ledger device.',
  url: 'https://glif.io',
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
    name: 'Infinite Scroll',
    description: 'Self-sustaining systems for the worlds to come.',
    url: 'https://infinitescroll.org',
    sameAs: [
      'https://github.com/infinitescroll',
      'https://twitter.com/infinitescroll_',
      'https://www.are.na/infinite-scroll'
    ]
  }
}
