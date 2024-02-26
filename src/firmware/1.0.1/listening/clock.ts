export const parseClock = (text: string, clock: 'round' | 'set') => (
  {
    raw: text,
    frame: (clock === 'round') ? 'round clock' : 'set clock'
  }
)
