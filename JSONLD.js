export default {
  '@context': 'http://schema.org/',
  '@type': 'Organization',
  name: 'Glif',
  description: 'An interoperable set of tools on the Filecoin network.',
  url: 'https://glif.io',
  sameAs: ['https://twitter.com/GLIFio'],
  owns: [
    {
      '@type': 'WebApplication',
      name: 'Glif Wallet',
      description:
        'A web wallet to manage your Filecoin on your Ledger device.',
      category: 'Blockchain software'
    },
    {
      '@type': 'WebApplication',
      name: 'Glif Nodes',
      description: 'Private and public gateways to the Filecoin network.',
      category: 'Blockchain software'
    }
  ],
  knowsAbout: [
    {
      '@type': 'SoftwareApplication',
      name: 'Filecoin',
      url: 'https://filecoin.io',
      category: 'Blockchain network'
    }
  ],
  parentOrganization: {
    '@type': 'Organization',
    name: 'Open Work Labs',
    description:
      'A product studio building tools for open work and the distributed web.',
    url: 'https://openworklabs.com',
    sameAs: [
      'https://github.com/openworklabs',
      'https://twitter.com/openworklabs',
      'https://www.are.na/open-work-labs'
    ]
  }
}
