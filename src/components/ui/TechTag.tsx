interface TechTagProps {
  label: string
}

export function TechTag({ label }: TechTagProps) {
  return (
    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono text-[#38BDF8] bg-[#06182A] border border-[#1B3A6E]">
      {label}
    </span>
  )
}
