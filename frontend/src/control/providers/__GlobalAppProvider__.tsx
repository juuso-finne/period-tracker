import type { PropsWithChildren } from "react"
import QueryClientProv from "./QueryClientProv"


const __GlobalAppProvider__ = ({children}: PropsWithChildren) => {
  return (
      <QueryClientProv>
              {children}
      </QueryClientProv>
  )
}

export default __GlobalAppProvider__