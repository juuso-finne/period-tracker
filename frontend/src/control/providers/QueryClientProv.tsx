import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import type { PropsWithChildren } from 'react';

const QueryClientProv = ({children}: PropsWithChildren) => {
    const qClient = new QueryClient

  return (
    <QueryClientProvider client={qClient}>
        {children}
    </QueryClientProvider>
  )
}

export default QueryClientProv