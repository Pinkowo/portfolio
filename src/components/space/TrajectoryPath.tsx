export function TrajectoryPath({ height }: { height: number }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none"
      style={{ width: 2, height, background: '#0D1B3E' }}
      aria-hidden
    />
  )
}
