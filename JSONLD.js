export default {
  '@context': 'http://schema.org/',
  '@type': 'Organization',
  name: 'Glif',
  description: 'An interoperable set of tools on the Filecoin network.',
  url: 'https://glif.io',
  owns: [
    {
      '@type': 'WebApplication',
      name: 'Glif Wallet',
      description:
        'A web wallet to manage your Filecoin on your Ledger device.',
      applicationCategory: 'Blockchain wallet',
      operatingSystem: 'All'
    },
    {
      '@type': 'WebApplication',
      name: 'Glif Nodes',
      description: 'Private and public gateways to the Filecoin network.',
      applicationCategory: 'Blockchain node infrastructure',
      operatingSystem: 'All'
    }
  ],
  knowsAbout: [
    {
      '@type': 'SoftwareApplication',
      name: 'Filecoin',
      url: 'https://filecoin.io',
      applicationCategory: 'Blockchain network',
      operatingSystem: 'All'
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
