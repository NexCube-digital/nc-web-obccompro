import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

type Option = {
	value: string;
	label: string;
};

type Props = {
	label: string;
	value: string;
	options: Option[];
	onValueChange: (value: string) => void;
	disabled?: boolean;
	className?: string;
	capitalize?: boolean;
};

export default function ThemedSelect({ label, value, options, onValueChange, disabled = false, className = "", capitalize = false }: Props) {
	return (
		<Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
			<Select.Trigger
				aria-label={label}
				className={`group flex h-9 min-w-0 items-center justify-between gap-1.5 rounded-lg border border-obc-border bg-[#FDFCF7] px-2.5 text-[12px] font-medium text-obc-charcoal shadow-sm outline-none transition-colors hover:border-[#9AAD3E] hover:bg-[#F8FAF1] focus-visible:ring-2 focus-visible:ring-[#CDF178] data-[state=open]:border-obc-green data-[state=open]:bg-white disabled:cursor-not-allowed disabled:opacity-60 ${capitalize ? "capitalize" : ""} ${className}`}
			>
				<Select.Value className="min-w-0 flex-1 truncate" />
				<Select.Icon asChild>
					<ChevronDown size={14} className="shrink-0 text-obc-green transition-transform group-data-[state=open]:rotate-180" />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content
					position="popper"
					side="bottom"
					sideOffset={4}
					align="start"
					avoidCollisions={false}
					className="z-[70] max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-obc-border bg-white p-1.5 shadow-[0_12px_30px_rgba(31,51,32,0.16)] outline-none"
				>
					<Select.Viewport className="max-h-60 overflow-y-auto">
						{options.map((option) => (
							<Select.Item
								key={option.value}
								value={option.value}
								className="flex cursor-pointer select-none items-center justify-between gap-3 rounded-md px-2.5 py-2 text-[12px] text-obc-charcoal outline-none data-[highlighted]:bg-[#F3F8E8] data-[highlighted]:text-obc-green data-[state=checked]:bg-[#E7F5D0] data-[state=checked]:font-semibold data-[state=checked]:text-obc-green"
							>
								<Select.ItemText>{option.label}</Select.ItemText>
								<Select.ItemIndicator>
									<Check size={14} strokeWidth={2.5} />
								</Select.ItemIndicator>
							</Select.Item>
						))}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}