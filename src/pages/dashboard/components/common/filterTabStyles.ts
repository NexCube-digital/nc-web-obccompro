export const filterTabListClass =
  "flex w-fit max-w-full gap-1 overflow-x-auto rounded-lg border border-obc-border bg-[#F3F5EF] p-1";

export const filterTabButtonClass = (selected: boolean) =>
  `group flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green focus-visible:ring-offset-1 active:scale-[0.98] ${selected ? "border-[#8EA832] bg-[#CDF178] text-[#1F3320] shadow-[0_1px_4px_rgba(31,51,32,0.16)] hover:bg-[#C3EA64]" : "border-transparent text-obc-muted hover:border-obc-border hover:bg-[#FDFCF7] hover:text-obc-charcoal"}`;

export const filterTabCountClass = (selected: boolean) =>
  `min-w-5 rounded px-1 text-center text-[10px] leading-5 transition-colors ${selected ? "bg-white/70 text-[#1F3320]" : "bg-[#E8EBE3] text-obc-muted group-hover:bg-[#F1F3EE] group-hover:text-obc-charcoal"}`;