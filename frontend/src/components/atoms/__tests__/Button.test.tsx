import React from 'react'
import { render, screen } from '@testing-library/react'
import Button from '../Button'

test('renders button with children', () => {
  render(<Button>Click</Button>)
  expect(screen.getByText('Click')).toBeInTheDocument()
})
