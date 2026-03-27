import { ThemeProvider } from "@/components/theme-provider";


export default function AboutPage() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme' >
      <h2>HELLO WORLD</h2>
    </ThemeProvider>
  )
}