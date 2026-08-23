import { beforeEach } from 'vitest'

class MemoryStorage {
  private store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }
}

const storage = new MemoryStorage()

beforeEach(() => {
  storage.clear()
})

const applyStorage = (target: object) => {
  try {
    Object.defineProperty(target, 'localStorage', {
      value: storage,
      configurable: true,
      writable: true,
    })
  } catch {
    ;(target as unknown as { localStorage: Storage }).localStorage = storage
  }
}

applyStorage(globalThis)
if (typeof window !== 'undefined') {
  applyStorage(window)
}
