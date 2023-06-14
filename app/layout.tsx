export const metadata = {
  title: 'Doug Lee Dot Co',
  description: 'Personal and project site of Doug Lee',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}
