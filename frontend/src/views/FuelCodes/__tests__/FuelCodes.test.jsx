import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor
} from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FuelCodes } from '@/views/FuelCodes'
// Import utilities directly, if getByDataTest is a custom utility, ensure it's correctly imported
import { getByDataTest } from '@/tests/utils/testHelpers'
import { ThemeProvider } from '@mui/material'
import theme from '@/themes'

// Mock the specific import of BCDataGridServer
vi.mock('@/components/BCDataGrid/BCDataGridServer', () => ({
  // Replace BCDataGridServer with a dummy component
  __esModule: true, // This is important for mocking ES modules
  default: () => <div data-test="mockedBCDataGridServer"></div>
}))

// You need to mock the entire module where useApiService is exported
vi.mock('@/services/useApiService', () => ({
  useApiService: () => ({
    download: vi.fn(() => new Promise((resolve) => setTimeout(resolve, 100)))
  })
}))

const renderComponent = () => {
  const queryClient = new QueryClient()
  render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Router>
          <FuelCodes />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

describe('FuelCodes Component Tests', () => {
  beforeEach(() => {
    renderComponent()
  })

  afterEach(() => {
    cleanup()
    vi.resetAllMocks() // Reset mocks to their initial state after each test
  })

  test('renders title correctly', () => {
    const { getByTestId } = render(<FuelCodes />, { wrapper: Router })
    const title = getByTestId('title')
    expect(title.textContent).toBe('Fuel codes')
  })

  test('clicking new fuel code button redirects to add page', () => {
    const { getByTestId } = render(<FuelCodes />, { wrapper: Router })
    const newFuelCodeBtn = getByTestId('new-fuel-code-btn')
    fireEvent.click(newFuelCodeBtn)
    expect(window.location.pathname).toBe('/admin/fuel-codes/add')
  })

  test('displays alert message on download failure', async () => {
    // Mocking API service to simulate download failure
    const mockApiService = {
      download: jest.fn().mockRejectedValue(new Error('Download failed'))
    }
    jest.mock('@/services/useApiService', () => ({
      useApiService: () => mockApiService
    }))

    const { getByTestId } = render(<FuelCodes />, { wrapper: Router })
    const downloadBtn = getByTestId('fuel-code-download-btn')
    fireEvent.click(downloadBtn)

    await waitFor(() => {
      const alertBox = getByTestId('alert-box')
      expect(alertBox.textContent).toContain(
        'Failed to download fuel code information'
      )
    })
  })

  describe('Download fuel codes information', () => {
    it('initially shows the download fuel codes button with correct text and enabled', () => {
      const downloadButton = getByDataTest('fuel-code-download-btn')
      expect(downloadButton).toBeInTheDocument()
      expect(downloadButton).toBeEnabled()
    })

    it('shows downloading text and disables the download fuel codes button during download', async () => {
      const downloadButton = getByDataTest('fuel-code-download-btn')
      fireEvent.click(downloadButton)

      // First, ensure the button text changes to the downloading state
      await waitFor(() => {
        expect(downloadButton).toHaveTextContent(
          /Downloading fuel codes information.../i
        )
      })
      // Then, check if the button gets disabled
      expect(downloadButton).toBeDisabled()
    })

    it('shows an error message if the download fuel codes fails', async () => {
      vi.mock('@/services/useApiService', () => ({
        useApiService: () => ({
          download: vi.fn(() => Promise.reject(new Error('Download failed')))
        })
      }))

      cleanup()
      renderComponent()

      const downloadButton = getByDataTest('fuel-code-download-btn')
      fireEvent.click(downloadButton)

      await waitFor(() => {
        const errorMessage = screen.getByText(
          /Failed to download fuel code information./i
        )
        expect(errorMessage).toBeInTheDocument()
      })
    })
  })
})
