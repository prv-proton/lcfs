import { useQuery } from '@tanstack/react-query'
import { useApiService } from '@/services/useApiService'

export const useUsers = (options) => {
  const client = useApiService()
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => (await client.post('/users/list')).data,
    ...options
  })
}
