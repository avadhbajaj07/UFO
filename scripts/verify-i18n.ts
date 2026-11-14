import * as fs from 'fs'
import * as path from 'path'

function getKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = []
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getKeys(obj[k], fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys.sort()
}

const messagesDir = path.join(process.cwd(), 'messages')
const locales = ['fr', 'en', 'de', 'it', 'es', 'pt']

console.log('--- Verifying i18n Translation Parity ---')

const dictionaries: Record<string, any> = {}
const keySets: Record<string, Set<string>> = {}

for (const loc of locales) {
  const filePath = path.join(messagesDir, `${loc}.json`)
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing dictionary: ${filePath}`)
    process.exit(1)
  }
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  dictionaries[loc] = content
  keySets[loc] = new Set(getKeys(content))
  console.log(`✅ Loaded ${loc}.json with ${keySets[loc].size} keys`)
}

const baseLocale = 'fr'
const baseKeys = keySets[baseLocale]

let hasError = false
for (const loc of locales) {
  if (loc === baseLocale) continue
  const currentKeys = keySets[loc]
  
  // Missing in target
  const missingInTarget = [...baseKeys].filter(k => !currentKeys.has(k))
  if (missingInTarget.length > 0) {
    console.error(`❌ [${loc}.json] Missing keys compared to ${baseLocale}:`, missingInTarget)
    hasError = true
  }

  // Extra in target
  const extraInTarget = [...currentKeys].filter(k => !baseKeys.has(k))
  if (extraInTarget.length > 0) {
    console.error(`❌ [${loc}.json] Extra keys not in ${baseLocale}:`, extraInTarget)
    hasError = true
  }
}

if (!hasError) {
  console.log(`\n🎉 All ${locales.length} dictionaries have 100% key parity (${baseKeys.size} keys each)!`)
} else {
  process.exit(1)
}
