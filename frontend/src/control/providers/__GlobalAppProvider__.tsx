
import QueryClientProv from "./QueryClientProv"
import RouterProv from "./RouterProv"


const __GlobalAppProvider__ = () => {
  return (
      <QueryClientProv>
        <RouterProv/>
      </QueryClientProv>
  )
}

export default __GlobalAppProvider__