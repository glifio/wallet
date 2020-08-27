import { cleanup, render, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import Glyph from '.'
import theme from '../theme'

describe('Glyph', () => {
  afterEach(cleanup)
  test('renders the HeaderGlyph', () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const { container } = render(
      <Tree>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          py={2}
          mr={[0, 6]}
          mb={[3, 0]}
          px={3}
          borderRadius={4}
          width={['100%', 'auto']}
          height='120px'
          css={`
            background: url(${imageUrl}) center no-repeat;
            background-size: 100%;
            border-radius: 16px;
            alt: ${alt};
          `}
        >
          <IconGlif
            fill='#fff'
            size={7}
            css={`
              transform: rotate(-90deg);
            `}
          />
          <Header color={color} ml={3}>
            {text}
          </Header>
        </Box>
      </Tree>
    )
    expect(Box).toMatchSnapshot()
  })

  test('renders the HeaderGlyph with the text', () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const { getByText } = render(
      <Tree>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          py={2}
          mr={[0, 6]}
          mb={[3, 0]}
          px={3}
          borderRadius={4}
          width={['100%', 'auto']}
          height='120px'
          css={`
            background: url(${imageUrl}) center no-repeat;
            background-size: 100%;
            border-radius: 16px;
            alt: ${alt};
          `}
        >
          <IconGlif
            fill='#fff'
            size={7}
            css={`
              transform: rotate(-90deg);
            `}
          />
          <Header color={color} ml={3}>
            {text}
          </Header>
        </Box>
      </Tree>
    )

    expect(getByText('Sw')).toBeTruthy()
    expect(Box).toMatchSnapshot()
  })

  
