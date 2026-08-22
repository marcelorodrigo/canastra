let lockCount = 0
let savedOverflow: string | null = null

export function useScrollLock() {
  const lock = () => {
    if (lockCount === 0) {
      savedOverflow = document.body.style.overflow
    }
    lockCount += 1
    document.body.style.overflow = 'hidden'
  }

  const unlock = () => {
    if (lockCount === 0) return
    lockCount -= 1
    if (lockCount === 0) {
      document.body.style.overflow = savedOverflow ?? ''
      savedOverflow = null
    }
  }

  return { lock, unlock }
}
