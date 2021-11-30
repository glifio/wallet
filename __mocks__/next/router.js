export const mockRouterReplace = jest.fn(() => {})
export const mockRouterPush = jest.fn(() => {})
export const mockRouterBack = jest.fn(() => {})

export const useRouter = jest.fn().mockImplementation(() => ({
  back: mockRouterBack,
  push: mockRouterPush,
  replace: mockRouterReplace,
  pathname: ''
}))

export default {
  push: mockRouterPush,
  replace: mockRouterReplace
}
