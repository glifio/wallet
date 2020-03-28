// Mocks useRouter
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

/**
 * mockNextUseRouter
 * Mocks the useRouter React hook from Next.js on a test-case by test-case basis
 */
// export function mockNextUseRouter(props: {
//   route: string,
//   pathname: string,
//   query: string,
//   asPath: string
// }) {
//   useRouter.mockImplementationOnce(() => ({
//     route: props.route,
//     pathname: props.pathname,
//     query: props.query,
//     asPath: props.asPath
//   }))
// }
