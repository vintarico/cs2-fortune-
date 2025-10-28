import React from 'react'
import cn from 'classnames'

export default function Button({ children, className, variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    primary: 'px-4 py-2 bg-primary text-white hover:brightness-95',
    ghost: 'px-3 py-2 bg-transparent border border-gray-700 text-white hover:bg-white/5'
  }
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}
