import { useTheme } from '@/components/theme-provider'

export function ExampleComponent() {
  const { currentScheme } = useTheme()

  return (
    <div style={{ backgroundColor: currentScheme.background, color: currentScheme.text }}>
      <h1 style={{ color: currentScheme.primary }}>Hello, World!</h1>
      <p style={{ color: currentScheme.secondary }}>This is an example of using the adjusted color scheme.</p>
      <button style={{ backgroundColor: currentScheme.accent, color: currentScheme.background }}>
        Click me
      </button>
    </div>
  )
}

