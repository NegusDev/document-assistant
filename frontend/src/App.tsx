import { LoginForm } from "@/components/login-form"
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from './components/mode-toggle'


function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme' >
      <ModeToggle />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
