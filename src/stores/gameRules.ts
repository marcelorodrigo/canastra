export function computeMaxTotal(totals: number[]): number {
  if (totals.length === 0) return -Infinity
  return Math.max(...totals)
}

export function computeLeaderIndices(totals: number[]): number[] {
  if (totals.length === 0) return []
  const max = computeMaxTotal(totals)
  return totals.reduce<number[]>((leaders, total, index) => {
    if (total === max) leaders.push(index)
    return leaders
  }, [])
}

export function computeWinnerIndices(totals: number[], winningPoints: number): number[] {
  const leaders = computeLeaderIndices(totals)
  if (leaders.length === 1 && totals[leaders[0]] >= winningPoints) {
    return leaders
  }
  return []
}

export function computeHasTieAtTop(totals: number[]): boolean {
  return computeLeaderIndices(totals).length > 1
}

export function computeIsInObrigacao(
  total: number,
  obrigacaoPoints: number,
  winningPoints: number,
): boolean {
  return total >= obrigacaoPoints && total < winningPoints
}

export function computeProgress(total: number, winningPoints: number): number {
  if (!winningPoints || winningPoints <= 0) return 0
  const percentage = (total / winningPoints) * 100
  return Math.max(0, Math.min(100, percentage))
}
