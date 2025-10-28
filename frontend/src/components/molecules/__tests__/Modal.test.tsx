import React from 'react'
import { render, screen } from '@testing-library/react'
import Modal from '../Modal'

test('renders modal children when open', () => {
  render(<Modal open={true} onClose={() => {}} title="T">Hello</Modal>)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
