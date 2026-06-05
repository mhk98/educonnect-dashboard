import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import './assets/css/tailwind.css'
import App from './App'
import { SidebarProvider } from './context/SidebarContext'
import ThemedSuspense from './components/ThemedSuspense'
import { Windmill } from '@windmill/react-ui'
import * as serviceWorker from './serviceWorker'

// if (process.env.NODE_ENV !== 'production') {
//   const axe = require('react-axe')
//   axe(React, ReactDOM, 1000)
// }

const windmillTheme = {
  button: {
    primary: {
      base: 'text-white bg-blue-800 border border-transparent',
      active: 'active:bg-blue-800 hover:bg-blue-900 focus:shadow-outline-blue',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },
  badge: {
    primary: 'text-blue-700 bg-blue-100 dark:text-white dark:bg-blue-700',
  },
  input: {
    active:
      'focus:border-blue-400 dark:border-gray-600 focus:shadow-outline-blue dark:focus:border-gray-600 dark:focus:shadow-outline-gray dark:bg-gray-700',
    radio: 'text-blue-700 form-radio focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray',
    checkbox: 'text-blue-700 form-checkbox focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray',
  },
  textarea: {
    active:
      'focus:border-blue-400 dark:border-gray-600 dark:focus:border-gray-600 dark:bg-gray-700 dark:focus:shadow-outline-gray focus:shadow-outline-blue',
  },
  select: {
    active:
      'focus:border-blue-400 dark:border-gray-600 dark:bg-gray-700 focus:shadow-outline-blue dark:focus:shadow-outline-gray dark:focus:border-gray-600',
  },
}

ReactDOM.render(
  <SidebarProvider>
    <Suspense fallback={<ThemedSuspense />}>
      <Windmill theme={windmillTheme}>
        <App />
      </Windmill>
    </Suspense>
  </SidebarProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
