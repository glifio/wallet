import dynamic from 'next/dynamic'

const RustComponent = dynamic({
  loader: async () => {
    // Import the wasm module
    const rustModule = await import('fcwebsigner')
    // Return a React component that calls the add_one method on the wasm module
    return () => (
      <button type='button' onClick={() => console.log(rustModule.hello())}>
        Say hello
      </button>
    )
  }
})

const Page = () => {
  return (
    <div>
      <RustComponent />
      yo
    </div>
  )
}

export default Page
