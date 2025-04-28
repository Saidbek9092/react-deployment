import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  it('renders the Vite and React logos', () => {
    render(<App />)
    
    const viteLogo = screen.getByAltText('Vite logo')
    const reactLogo = screen.getByAltText('React logo')
    
    expect(viteLogo).toBeInTheDocument()
    expect(reactLogo).toBeInTheDocument()
  })

  it('renders the main heading', () => {
    render(<App />)
    const heading = screen.getByText('Vite + React')
    expect(heading).toBeInTheDocument()
  })

  it('increments count when button is clicked', () => {
    render(<App />)
    const button = screen.getByText(/count is/i)
    
    // Initial count should be 0
    expect(button.textContent).toBe('count is 0')
    
    // Click the button
    fireEvent.click(button)
    
    // Count should be 1 after click
    expect(button.textContent).toBe('count is 1')
  })

  it('renders the edit instruction text', () => {
    render(<App />)
    const codeElement = screen.getByText('src/App.tsx')
    expect(codeElement).toBeInTheDocument()
  })
}) 