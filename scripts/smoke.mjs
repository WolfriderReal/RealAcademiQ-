const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:3000'

async function checkPage(path, expectedText) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'follow' })
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`)
  }

  const html = await response.text()
  if (!html.includes(expectedText)) {
    throw new Error(`${path} did not include expected text: ${expectedText}`)
  }
}

async function main() {
  await checkPage('/', 'Submit Your Order')
  await checkPage('/order', 'Submit Your Order')
  await checkPage('/track-order', 'Track Your Order via WhatsApp')
  await checkPage('/services', 'Our Services')
  console.log('Smoke tests passed')
}

main().catch((error) => {
  console.error('Smoke tests failed:', error.message)
  process.exit(1)
})
